function normalizePageIndex(responsePageIndex, requestedPageIndex) {
  if (Number.isInteger(responsePageIndex) && responsePageIndex >= 0) {
    return responsePageIndex + 1;
  }

  return requestedPageIndex;
}

export { normalizePageIndex };
