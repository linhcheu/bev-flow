export const usePagination = <T>(items: Ref<T[]>, pageSize: number = 25) => {
  const currentPage = ref(1);
  const itemsPerPage = ref(pageSize);

  const totalPages = computed(() => Math.ceil(items.value.length / itemsPerPage.value));
  
  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return items.value.slice(start, end);
  });

  const totalItems = computed(() => items.value.length);

  const startItem = computed(() => {
    if (items.value.length === 0) return 0;
    return (currentPage.value - 1) * itemsPerPage.value + 1;
  });

  const endItem = computed(() => {
    const end = currentPage.value * itemsPerPage.value;
    return Math.min(end, items.value.length);
  });

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  const firstPage = () => {
    currentPage.value = 1;
  };

  const lastPage = () => {
    currentPage.value = totalPages.value;
  };

  // Reset to first page when items change significantly
  watch(items, (newItems, oldItems) => {
    if (Math.abs(newItems.length - oldItems.length) > itemsPerPage.value) {
      currentPage.value = 1;
    } else if (currentPage.value > Math.ceil(newItems.length / itemsPerPage.value)) {
      currentPage.value = Math.max(1, Math.ceil(newItems.length / itemsPerPage.value));
    }
  });

  // Generate visible page numbers
  const visiblePages = computed(() => {
    const pages: number[] = [];
    const total = totalPages.value;
    const current = currentPage.value;
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push(-1); // ellipsis
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push(-1);
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(total);
      }
    }
    
    return pages;
  });

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems,
    totalItems,
    startItem,
    endItem,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    visiblePages,
  };
};
