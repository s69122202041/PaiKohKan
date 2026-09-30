<script setup lang="ts">
const route = useRoute()
const pages = [
  { to: '/', label: '1 เลือกกิจกรรม' },
  { to: '/roadmap', label: '2 จัดเส้นทาง' },
  { to: '/plan', label: '3 เปรียบเทียบ' },
  { to: '/summary', label: '4 ทริปของฉัน' }
]
const active = (to: string) => (route.path.replace(/\/$/, '') || '/') === to
</script>

<template>
  <div>
    <header>
      <NuxtLink class="logo" :to="{ path: '/', query: route.query }">
        <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
          <circle cx="20" cy="20" r="19" fill="#2f6b4f" />
          <path d="M8 26Q14 21 20 26T32 26" stroke="#fff" stroke-width="2.5" fill="none" />
          <path d="M20 8C26 12 27 17 20 22C13 17 14 12 20 8Z" fill="#e3edd6" />
        </svg>
        <span>ไปเกาะกัน<small>วางแผนทริปเกาะอันดามัน</small></span>
      </NuxtLink>
      <nav>
        <NuxtLink v-for="p in pages" :key="p.to" :to="{ path: p.to, query: route.query }" :class="{ on: active(p.to) }">{{ p.label }}</NuxtLink>
      </nav>
    </header>
    <main><slot /></main>
  </div>
</template>
