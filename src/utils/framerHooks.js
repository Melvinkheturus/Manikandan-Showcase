// Framer Motion SSR compatibility
// This file provides a solution for the "Cannot read properties of undefined (reading 'useLayoutEffect')" error

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Fix for Framer Motion "useLayoutEffect" warning in SSR
if (!isBrowser) {
  // When in a non-browser environment (like SSR), mock useLayoutEffect with useEffect
  React.useLayoutEffect = React.useEffect;
}

export { isBrowser }; 