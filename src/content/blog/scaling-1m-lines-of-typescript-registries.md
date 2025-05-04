Today, we have about 1.1M lines of committed Typescript code in our monorepo. Scaling it has come with a myriad of challenges — in particular, slow type checking, bloated imports, and code traceability. Over the past few years, we’ve explored and iterated with various design patterns to best scale our codebase. In the process, we made mistakes and wrote code in ways that caused issues as our codebase grew. We eventually stumbled upon a pattern we now call Registries. It’s simple and one of the most scalable patterns we’ve adopted.

Our original internal event handling code is a good example of where this pattern made a huge difference. It started simple, but over time led to giant type unions, scattered handlers, and messy imports that slowed everything down.

Here's a look at how it was originally structured, and why it fell apart at scale.

### Original design

1. Define a set of base-helpers:
    
    ```tsx
    // ./app-event-handler/base.ts
    export interface AppEventBase {
    	type: string;
    }
    
    export interface AppEventHandler<Ev extends AppEventBase> {
    	type: Ev['type'];
    	handler: (data: Ev) => Promise<void>
    }
    
    export function createAppEventHandler<Ev extends AppEvenBaset>(
    	event: Ev['type',
    	handler: (data: Ev) => Promise<void>
    ): EventHandler<Ev> {
    	return { type: event, handler }
    }
    ```
    
2. Define your event handlers in their own file
    
    ```tsx
    // ./app-event-handlers/card.ts
    import type { AppEventBase } from './base.ts';
    
    interface CardCreatedAppEvent {
    	type: 'card_created';
    	cardName: string;
    }
    
    export const cardCreatedEventHandler = createAppEventHandler<CardCreatedAppEvent>(
      'card_created',
      async (ev) => {
    	  await sendNotificationToUsers();
      }
    );
    
    // ./app-event-handlers/wire.ts
    import type { AppEventBase } from './base.ts';
    
    interface WireSentEvent extends EventBase {
      type: 'wire.sent';
      amount: number;
    }
    
    export const wireSentEventHandler = createEventHandler<WireCreatedEvent>(
      'wire_created',
      async (ev) => {
    	  await sendNotificationToUsers();
      }
    )
    ```
    
3. Define a rollup file
    
    ```tsx
    // ./app-event-handlers/rollup.ts
    export * from './card.ts';
    export * from './wire.ts';
    ```
    
4. Define event handlers
    
    ```tsx
    // ./app-event-handlers/index.ts
    import type { AppEventBase } from './base.ts';
    import * as AppEventHandlers from './rollup.ts';
    
    export type AppEvent = {
    	[Key in keyof typeof EventHandlers]: 
    		(typeof EventHandlers)[Key] extends AppEventHandler<infer Ev extends AppEventBase>
    			? Ev
    			: never;
    }[keyof typeof EventHandlers];
    
    export { AppEventHandlers };
    ```
    
5. Define a common function to record events
    
    ```tsx
    // ./record-app-event.ts
    import { mqClient } from '@server/message-queue/client.ts';
    import type { AppEvent } from './app-event-handlers'
    
    export async function recordEvent<Ev extends AppEvent>(ev: Ev) {
    	await mqClient.push('events', ev);
    }
    ```
    
6. Export a function that processes the event handler for the queue in a worker
    
    ```tsx
    // ./process-app-event.ts
    import { AppEventHandlers, type AppEvent } from './app-event-handlers/index.ts';
    
    const appEventHandlerMap = new Map(
    	Object.values(AppEventHandlers).map(item => [item.type, item.handler])
    );
    
    export async function processAppEventHandler(ev: AppEvent) {
    	const handler = appEventHandlerMap.get(ev.type);
    	
    	if (!handler) {
    		throw 'some error';
    	}
    
    	await handler(ev as any);
    }
    ```
    
At a glance, this design looks pretty okay. It's type safe, easy to understand and work with, and clear on how to create new events. However, there were several issues:

**Type checking complexity:** For each new event, the `AppEvent` union type grows larger. Individually, a single union isn't problematic, but as the usage of this pattern increases across the codebase (multiple type unions), type checking performance quickly degrades.

**Eager module loading:** Our pattern of rollup files meant nearly every module imported the entire codebase at startup, making lazy-loading impossible. This also prevented us from easily splitting the server into separate bundles for different deployments. While eager-loading the full codebase was acceptable in production, it severely impacted development and testing, taking over 20–30 seconds just to start the development server.

**Poor traceability:** Answering simple questions like "where is this event's implementation?" or "where is this handler called?" was difficult. We had to rely on full-text searches of string literals. If event names were constructed using dynamic string interpolation, it became very hard to figure out where events were called from.

**Lack of clear domain boundaries:** As we introduced more homogeneous interfaces (event handlers, DB entities, health checks), it encouraged colocating similar interfaces in the same folder rather than grouping by domain logic. This fragmented our business logic, making domain-specific context switching more frequent and complex.

### Iterating on this design

In the setup above, we put all event handlers in `./app-event-handlers/<event_type>.ts` files. While having them all in one folder made discovery easy, it didn’t reflect how we actually worked. In practice, colocating event handlers with the rest of the relevant application logic proved way more useful than grouping them with other handlers.

That’s where the idea of adding subextensions to files (`.event-handler.ts`) came in. They let us colocate by domain while still enabling easy discovery by looking up the extension. The file extension further allowed us to remove manually maintained rollup files since we could scan for the extension in the repository at runtime.

// irrelevant
1. We have a lot of typescript code and have been maintaining the same codebase for 4.5 years
2. Talk about old patterns:
    1. Barrel files
    2. Colocating “technical” concepts in our codebase together, rather than grouping by business domain.
        1. Colocating all DB entities in one folder is actually really nice at the beginning, but as application logic grows, it becomes messy and it becomes hard to track what are all the relevant dependencies for the same project
3. Starting to create patterns where we add extensions to files — `.db.ts` for DB entities. Every `.db.ts` file gets registered by our ORM. We define the `.db.ts` file with the rest of the relevant business logic.
    1. Give more examples of how other `.<extension>.ts` files work in our codebase
        1. Some of them exist as like “.db.ts” files that register DB entities to our ORM
        2. `.workflows.ts` register temporal workflows
        3. `.activities.ts` register temporal activities
        4. `.cron.ts` registers cron jobs
        5. `.checks.ts` registers health checks
4. Describe a “how it works”:
    1. Each `.extension.ts` file can export anything, but should generally export an object with a `$type` field.
    

Old patterns:

1. Barrel files, large type unions
    1. Runtime implications: 
        1. can’t lazy load modules — longer dev start time for both server and client (even NextJS)
        2.  project takes way longer to start up
    2. Can’t split up app into multiple smaller apps in different deployments — for example:
        1. Only modules relevant to a specific subset of API endpoints are included (separate public API pods)
        2. A pod dedicated to processing work for a task queue that only handles “ledger” code (should be able to omit 90% of all business logic)
    3. Type checking implications
        1. Similarly, type checking incurs on all 

One of our services — an events handler service, used to be designed around type unions + a rollup / barrel files in order to

We used to extensively use barrel files for organization — there has been a lot of talk online about barrel files being bad, and we agree. Most painfully, our overuse of barrel files caused most files to cascade and import the entire project. This is fine on production because you typically do want all files to be imported so it doesn’t, for example, incur additional runtime costs while serving an API request. 
