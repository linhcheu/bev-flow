export const useSidebar = () => {
  const isExpanded = useState('sidebarExpanded', () => true);
  const isMobileOpen = useState('sidebarMobileOpen', () => false);
  
  const toggleSidebar = () => {
    isExpanded.value = !isExpanded.value;
  };
  
  const toggleMobileSidebar = () => {
    isMobileOpen.value = !isMobileOpen.value;
  };
  
  const closeMobileSidebar = () => {
    isMobileOpen.value = false;
  };
  
  return {
    isExpanded,
    isMobileOpen,
    toggleSidebar,
    toggleMobileSidebar,
    closeMobileSidebar
  };
};
