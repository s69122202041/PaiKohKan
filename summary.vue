<script setup lang="ts">
const route = useRoute()
const from = qstr(route.query.from) || 'Phuket'
const mode = COST[qstr(route.query.mode)] ? qstr(route.query.mode) : 'mix'
const stops = qlist(route.query.stops).filter(v => graph[v] && v !== from)
const acts = qlist(route.query.acts).filter(a => findLeaf(a))
const doPrint = () => window.print()
const time = ref('08:00')
const r = stops.length ? bestTrip(from, stops, mode) : null
const x = r ? totals(r.path) : null
const mark = r ? Object.fromEntries(r.order.map((v, i) => [v, i ? String(i) : 'เริ่ม'])) : {}
// สร้างตารางเดินทาง: เวลาออก-ถึงของแต่ละช่วง และกิจกรรมที่เกาะที่แวะ
const steps = computed(() => {
  if (!r) return []
  const [h, m] = time.value.split(':').map(Number)
  let clock = h * 60 + m
  return legs(r.path).map(l => {
    const a = clock; clock += l.t
    const node = ISLANDS.find(n => n.v === l.to)
    const mine = acts.filter(n => islandOf(findLeaf(n)!) === l.to)
    return { ...l, dep: hm(a), arr: hm(clock), stop: stops.includes(l.to), mine, tips: node ? kids(node).map(n => n.name) : [] }
  })
})
</script>

<template>
  <div>
    <section class="hero">
      <h1>ทริปของฉัน: แบบ{{ MODE[mode] }}</h1>
      <p>ตารางเดินทางและค่าเรือโดยประมาณ (ข้อมูลจำลองเพื่อการสาธิต)</p>
    </section>
    <div v-if="!r" class="card"><p>ยังไม่มีทริป <NuxtLink to="/">เริ่มเลือกกิจกรรม</NuxtLink></p></div>
    <template v-else>
      <div class="g2">
        <section class="card">
          <div class="row"><label>เรือออกรอบแรกเวลา <input v-model="time" type="time"></label></div>
          <div class="step"><b>เริ่มต้นที่ {{ LABEL[from] }}</b></div>
          <div v-for="(s, i) in steps" :key="i" class="step">
            <b>ล่องเรือ {{ LABEL[s.from] }} → {{ LABEL[s.to] }}</b><br>
            <span class="mut">ออก {{ s.dep }} ถึง {{ s.arr }} · {{ dur(s.t) }} · {{ s.f }} บาท</span><br>
            <span v-if="!s.stop" class="mut">แวะเปลี่ยนเรือ</span>
            <template v-else-if="s.mine.length"><span v-for="n in s.mine" :key="n" class="chip">{{ n }}</span></template>
            <template v-else><span v-for="n in s.tips" :key="n" class="chip tip">แนะนำ: {{ n }}</span></template>
          </div>
          <p class="mut">เวลาเป็นการประมาณ ไม่รวมเวลาทำกิจกรรมและรอเรือ</p>
        </section>
        <aside class="card">
          <h3>ค่าเรือ</h3>
          <table>
            <tr v-for="(s, i) in steps" :key="i"><td>{{ LABEL[s.from] }} → {{ LABEL[s.to] }}</td><td class="r">{{ s.f }} ฿</td></tr>
            <tr><th>รวม</th><th class="r">{{ x!.f }} ฿</th></tr>
          </table>
          <p class="mut">ใช้เวลารวม {{ dur(x!.t) }}</p>
          <div class="row noprint" style="margin-top:14px">
            <button @click="doPrint">พิมพ์ / บันทึกเป็น PDF</button>
            <NuxtLink class="btn" :to="{ path: '/', query: { acts: acts.join(',') } }">แก้ไขทริป</NuxtLink>
          </div>
        </aside>
      </div>
      <section class="card"><TripMap :path="r.path" :mark="mark" /></section>
    </template>
  </div>
</template>
