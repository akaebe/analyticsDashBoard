// src/utils/dataUtils.js
export const dataUtils = {
  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const value = String(item[key]);
      if (!groups[value]) {
        groups[value] = [];
      }
      groups[value].push(item);
      return groups;
    }, {});
  },

  sumBy(array, key) {
    return array.reduce((sum, item) => {
      return sum + (parseFloat(String(item[key])) || 0);
    }, 0);
  },

  avgBy(array, key) {
    if (array.length === 0) return 0;
    return this.sumBy(array, key) / array.length;
  },

  maxBy(array, key) {
    if (array.length === 0) return 0;
    return Math.max(...array.map(item => parseFloat(String(item[key])) || 0));
  },

  minBy(array, key) {
    if (array.length === 0) return 0;
    return Math.min(...array.map(item => parseFloat(String(item[key])) || 0));
  },

  sortBy(array, key, order = 'asc') {
    return [...array].sort((a, b) => {
      const aVal = parseFloat(String(a[key])) || 0;
      const bVal = parseFloat(String(b[key])) || 0;
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    });
  },

  unique(array) {
    return [...new Set(array)];
  },

  chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },
};
