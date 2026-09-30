<script setup lang="ts">
const route = useRoute()
const acts = qlist(route.query.acts).filter(a => findLeaf(a))
const pre = route.query.stops ? qlist(route.query.stops) : acts.map(a => islandOf(findLeaf(a)!))
const from = ref(qstr(route.query.from) || 'Phuket')
const mode = ref(MODE[qstr(route.query.mode)] ? qstr(route.query.mode) : 'time')
const stops = ref<string[]>([...new Set(pre)])
const chosen = computed(() => stops.value.filter(v => v !== from.value))
const r = computed(() => bestTrip(from.value, chosen.value, mode.value))
const x = computed(() => totals(r.value.path))
const mark = computed(() => Object.fromEntries(r.value.order.map((v, i) => [v, i ? String(i) : 'เริ่ม'])))
const near = computed(() => bfsLevels(graph, from.value))
</script>

<template>
  <div>
    <section class="hero">
      <h1>จัดเส้นทางเรือให้ทริปของคุณ</h1>
      <p>เลือกจุดเริ่มต้นและเกาะที่อยากไป ระบบจะหาลำดับการแวะที่เหมาะที่สุด</p>
    </section>
    <section class="card">
      <div class="row">
        <label>เริ่มต้นจาก
          <select v-model="from"><option v-for="v in Object.keys(graph)" :key="v" :value="v">{{ LABEL[v] }}</option></select>
        </label>
        <label>เลือกแบบ
          <select v-model="mode"><option v-for="(n, k) in MODE" :key="k" :value="k">{{ n }}</option></select>
        </label>
      </div>
      <p class="mut" style="margin:0 0 8px">เกาะที่อยากไป</p>
      <div class="tiles">
        <label v-for="n in ISLANDS" :key="n.v" class="tile">
          <input v-model="stops" type="checkbox" :value="n.v"><span><b>{{ n.name }}</b></span>
        </label>
      </div>
      <div v-if="chosen.length" style="margin-top:16px">
        <p class="big">{{ r.order.map(v => LABEL[v]).join(' → ') }}</p>
        <p>เส้นทางเรือทั้งหมด: {{ r.path.map(v => LABEL[v]).join(' → ') }}<br>
          รวม <b>{{ dur(x.t) }}</b> · <b>{{ x.f }} บาท</b> · ต่อเรือ {{ x.n }} ครั้ง</p>
        <NuxtLink class="btn" :to="{ path: '/plan', query: { from, stops: chosen.join(','), acts: acts.join(',') } }">เปรียบเทียบ 3 แบบ</NuxtLink>
      </div>
      <p v-else class="mut" style="margin-top:16px">เลือกเกาะที่อยากไปอย่างน้อย 1 แห่ง</p>
    </section>
    <section class="card"><TripMap :path="chosen.length ? r.path : []" :mark="mark" /></section>
    <section class="card">
      <h3>เกาะที่ไปถึงได้จากจุดเริ่มต้น</h3>
      <p v-for="(l, i) in near" :key="i"><b>ต่อเรือ {{ i + 1 }} ครั้ง:</b> {{ l.map(v => LABEL[v]).join(', ') || '-' }}</p>
    </section>
  </div>
</template>
