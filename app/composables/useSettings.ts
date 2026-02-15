// Settings composable - lightweight, session info is hardcoded (7-day weekly reset)
import { ref, readonly } from 'vue';
import { AUTH_CONFIG } from '../utils/auth-config';

// Shared state
const error = ref('');
const successMessage = ref('');

export const useSettings = () => {
  const clearMessages = () => {
    error.value = '';
    successMessage.value = '';
  };

  /** Returns a human-readable session policy string */
  const sessionPolicy = AUTH_CONFIG.SESSION_POLICY;

  /** Returns when the current session expires (from localStorage) */
  const getSessionExpiryDisplay = (): string => {
    if (!import.meta.client) return 'N/A';
    const expiry = localStorage.getItem('tokenExpiry');
    if (!expiry) return 'N/A';
    const expiryDate = new Date(parseInt(expiry));
    return expiryDate.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return {
    error: readonly(error),
    successMessage: readonly(successMessage),
    clearMessages,
    sessionPolicy,
    getSessionExpiryDisplay,
  };
};
