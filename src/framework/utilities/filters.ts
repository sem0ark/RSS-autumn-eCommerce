export const filterSimilar = (search: string, sample: string) => {
  const lcSearch = search.toLowerCase();
  const lcSample = sample.toLowerCase();

  let i = 0;
  for (const ch of lcSample) {
    if (ch == lcSearch[i]) i++;
    if (i >= lcSearch.length) return true;
  }

  return i >= lcSearch.length;
};
