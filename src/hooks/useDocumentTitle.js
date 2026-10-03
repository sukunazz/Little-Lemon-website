import { useEffect } from 'react';

/** Sets the browser tab title so screen reader users hear which page they are on. */
const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | Little Lemon` : 'Little Lemon – Mediterranean Restaurant, Chicago';
  }, [title]);
};

export default useDocumentTitle;
