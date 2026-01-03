// Shared formatting utilities - use across all pages
// Centralized formatting functions for consistent display

/**
 * Format number with locale-specific thousands separators
 */
export const formatNumber = (num: number, decimals = 2): string => {
  return num.toLocaleString('en-US', { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  });
};

/**
 * Format currency with $ symbol
 */
export const formatCurrency = (amount: number): string => {
  return `$${formatNumber(amount)}`;
};

/**
 * Format large numbers for charts (1K, 1M, etc.)
 */
export const formatChartValue = (value: number): string => {
  if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
  if (value >= 1000) return (value / 1000).toFixed(1) + 'k';
  return value.toFixed(0);
};

/**
 * Format date for display
 */
export const formatDate = (date: string | Date, format: 'short' | 'long' | 'full' = 'short'): string => {
  const d = new Date(date);
  
  switch (format) {
    case 'full':
      return d.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'long':
      return d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'short':
    default:
      return d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
  }
};

/**
 * Format time from date
 */
export const formatTime = (date: string | Date): string => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format datetime
 */
export const formatDateTime = (date: string | Date): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
};

/**
 * Format percentage
 */
export const formatPercent = (value: number, decimals = 0): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Get profit/loss color class
 */
export const getProfitColorClass = (value: number): string => {
  if (value > 0) return 'text-emerald-600';
  if (value < 0) return 'text-red-600';
  return 'text-zinc-600';
};

/**
 * Get profit/loss badge class
 */
export const getProfitBadgeClass = (value: number): string => {
  if (value > 0) return 'text-emerald-600 bg-emerald-50';
  if (value < 0) return 'text-red-600 bg-red-50';
  return 'text-zinc-600 bg-zinc-50';
};

/**
 * Get stock level color class
 */
export const getStockColorClass = (current: number, min: number): string => {
  if (current <= 0) return 'text-red-600';
  if (current <= min) return 'text-amber-600';
  return 'text-emerald-600';
};

/**
 * Get status badge color class
 */
export const getStatusColorClass = (status: string): string => {
  const statusLower = status.toLowerCase();
  
  if (['completed', 'received', 'paid', 'active'].includes(statusLower)) {
    return 'bg-emerald-50 text-emerald-700';
  }
  if (['pending', 'processing', 'ordered'].includes(statusLower)) {
    return 'bg-amber-50 text-amber-700';
  }
  if (['cancelled', 'rejected', 'failed', 'inactive'].includes(statusLower)) {
    return 'bg-red-50 text-red-700';
  }
  if (['shipped', 'in transit', 'partial'].includes(statusLower)) {
    return 'bg-blue-50 text-blue-700';
  }
  
  return 'bg-zinc-100 text-zinc-700';
};

// Composable wrapper for use in Vue components
export const useFormatters = () => {
  return {
    formatNumber,
    formatCurrency,
    formatChartValue,
    formatDate,
    formatTime,
    formatDateTime,
    formatRelativeTime,
    formatPercent,
    truncateText,
    getProfitColorClass,
    getProfitBadgeClass,
    getStockColorClass,
    getStatusColorClass,
  };
};
