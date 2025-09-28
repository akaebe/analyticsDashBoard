// src/utils/formatUtils.js
export const formatUtils = {
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  },

  formatExactNumber(num) {
    return parseInt(String(num)).toLocaleString();
  },

  formatDuration(minutes) {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = Math.round(minutes % 60);
      return `${hours}h ${mins}m`;
    }
  },

  formatPercentage(num, total) {
    if (total === 0) return '0%';
    return ((num / total) * 100).toFixed(1) + '%';
  },

  parseInt(value) {
    const num = parseInt(String(value));
    return !isNaN(num) && isFinite(num) ? num : 0;
  },

  parseNumber(value) {
    const num = parseFloat(String(value));
    return !isNaN(num) && isFinite(num) ? num : 0;
  },

  isValidNumber(value) {
    return !isNaN(value) && isFinite(value);
  },
};
