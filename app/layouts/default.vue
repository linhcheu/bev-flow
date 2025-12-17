<template>
  <div class="flex min-h-screen bg-neutral-50">
    <!-- Luxury Minimalist Sidebar -->
    <aside class="w-72 bg-[#1a1a1a] text-neutral-100 fixed h-screen overflow-y-auto border-r border-neutral-800">
      <div class="px-8 py-10 border-b border-neutral-800">
        <h2 class="text-2xl font-light tracking-[0.2em] uppercase text-[#D4AF37]">BEV Flow</h2>
        <p class="text-xs text-neutral-500 mt-1 tracking-wider uppercase">Management System</p>
      </div>
      
      <nav class="px-4 py-8 space-y-1">
        <NuxtLink 
          to="/" 
          class="flex items-center gap-4 px-5 py-4 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900/50 transition-all duration-300 no-underline group router-link-active:bg-[#D4AF37]/10 router-link-active:text-[#D4AF37] router-link-active:border-l-2 router-link-active:border-[#D4AF37]"
        >
          <span class="text-lg opacity-60 group-hover:opacity-100 transition-opacity">📊</span>
          <span class="text-sm font-light tracking-wide">Dashboard</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/products" 
          class="flex items-center gap-4 px-5 py-4 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900/50 transition-all duration-300 no-underline group router-link-active:bg-[#D4AF37]/10 router-link-active:text-[#D4AF37] router-link-active:border-l-2 router-link-active:border-[#D4AF37]"
        >
          <span class="text-lg opacity-60 group-hover:opacity-100 transition-opacity">📦</span>
          <span class="text-sm font-light tracking-wide">Products</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/suppliers" 
          class="flex items-center gap-4 px-5 py-4 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900/50 transition-all duration-300 no-underline group router-link-active:bg-[#D4AF37]/10 router-link-active:text-[#D4AF37] router-link-active:border-l-2 router-link-active:border-[#D4AF37]"
        >
          <span class="text-lg opacity-60 group-hover:opacity-100 transition-opacity">🏢</span>
          <span class="text-sm font-light tracking-wide">Suppliers</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/purchase-orders" 
          class="flex items-center gap-4 px-5 py-4 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900/50 transition-all duration-300 no-underline group router-link-active:bg-[#D4AF37]/10 router-link-active:text-[#D4AF37] router-link-active:border-l-2 router-link-active:border-[#D4AF37]"
        >
          <span class="text-lg opacity-60 group-hover:opacity-100 transition-opacity">📋</span>
          <span class="text-sm font-light tracking-wide">Purchase Orders</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/sales" 
          class="flex items-center gap-4 px-5 py-4 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900/50 transition-all duration-300 no-underline group router-link-active:bg-[#D4AF37]/10 router-link-active:text-[#D4AF37] router-link-active:border-l-2 router-link-active:border-[#D4AF37]"
        >
          <span class="text-lg opacity-60 group-hover:opacity-100 transition-opacity">💰</span>
          <span class="text-sm font-light tracking-wide">Sales</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/forecasts" 
          class="flex items-center gap-4 px-5 py-4 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900/50 transition-all duration-300 no-underline group router-link-active:bg-[#D4AF37]/10 router-link-active:text-[#D4AF37] router-link-active:border-l-2 router-link-active:border-[#D4AF37]"
        >
          <span class="text-lg opacity-60 group-hover:opacity-100 transition-opacity">📈</span>
          <span class="text-sm font-light tracking-wide">Forecasts</span>
        </NuxtLink>
      </nav>
    </aside>
    
    <main class="flex-1 ml-72 min-h-screen">
      <slot />
    </main>
  </div>
</template>
