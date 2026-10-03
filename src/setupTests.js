import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

// jsdom does not implement scrolling; stub it so navigation code can run in tests.
window.scrollTo = () => {};
Element.prototype.scrollIntoView = () => {};
