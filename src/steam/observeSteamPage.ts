/** Steam loads items without a reload and reuses link elements, changing only their `href`. */
const PAGE_CHANGE_OPTIONS: MutationObserverInit = {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['href'],
};

/** Calls back now and after every page change; returns the function that stops observing. */
export function observeSteamPage(handlePageChange: () => void): () => void {
  handlePageChange();
  const pageObserver = new MutationObserver(handlePageChange);
  pageObserver.observe(document.body, PAGE_CHANGE_OPTIONS);
  return () => {
    pageObserver.disconnect();
  };
}
