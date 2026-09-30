<script setup lang="ts">
const route = useRoute()
const from = qstr(route.query.from) || 'Phuket'
const acts = qstr(route.query.acts)
const stops = qlist(route.query.stops).filter(v => graph[v] && v !== from)
const tip: Record<string, string> = { time: 'ถึงเร็ว มีเวลาทำกิจกรรมมากขึ้น', fare: 'ค่าเรือรวมน้อยที่สุด', mix: 'ไม่ช้าเกินไปและไม่แพงเกินไป' }
// รัน Dijkstra 3 รอบ ด้วยนิยามน้ำหนักต่างกัน (เวลา / ค่าเรือ / ผสม)
const options = stops.length ? Object.keys(MODE).map(k => { const r = bestTrip(from, stops, k); return { k, r, x: totals(r.path) } }) : []
const view = ref('time')
const shown = computed(() => options.find(o => o.k === view.value)?.r)
const mark = computed(() => Object.fromEntries((shown.value?.order || []).map((v, i) => [v, i ? String(i) : 'เริ่ม'])))
</script>

<template>
  <div>
    <section class="hero">
      <h1>เลือกแบบที่ใช่สำหรับทริปนี้</h1>
      <p>เราจัดทริปเดียวกันไว้ 3 แบบ ให้เทียบเวลาและค่าเรือ</p>
    </section>
    <div v-if="!stops.length" class="card"><p>ยังไม่ได้เลือกเกาะ <NuxtLink to="/">กลับไปเลือกกิจกรรม</NuxtLink></p></div>
    <div class="grid">
      <div v-for="o in options" :key="o.k" class="card">
        <h3>{{ MODE[o.k] }}</h3>
        <p class="mut">{{ tip[o.k] }}</p>
        <p>{{ o.r.order.map(v => LABEL[v]).join(' → ') }}</p>
        <p><span class="big">{{ dur(o.x.t) }}</span><br><b>{{ o.x.f }} บาท</b> · ต่อเรือ {{ o.x.n }} ครั้ง</p>
        <div class="row">
          <button class="alt" @click="view = o.k">ดูบนแผนที่</button>
          <NuxtLink class="btn" :to="{ path: '/summary', query: { from, stops: stops.join(','), acts, mode: o.k } }">เลือกแบบนี้</NuxtLink>
        </div>
      </div>
    </div>
    <section class="card"><TripMap :path="shown?.path" :mark="mark" /></section>
  </div>
</template>
