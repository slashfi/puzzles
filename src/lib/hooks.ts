export type IdRef<Id extends string = string> = {
  current(): HTMLElement | null;
  id: Id;
};

/**
 * A hook that provides a ref-like interface for accessing elements by ID
 * This is useful for server components that can't use useRef
 */
export function useIdRef<Str extends string>(id: Str): IdRef<Str> {
  // Create a getter function that always gets the latest element
  const getCurrentElement = () => {
    console.log('GETT');
    if (typeof document === 'undefined') {
      return null;
    }
    return document.getElementById(id);
  };

  // Return an object that mimics the useRef interface
  return {
    current() {
      return getCurrentElement();
    },
    id,
  };
}
