<script setup lang="ts">
const props = defineProps<{ path?: string[]; mark?: Record<string, string> }>()
const edges = Object.keys(graph).flatMap(a => Object.keys(graph[a]).filter(b => a < b).map(b => ({ a, b, A: POS[a], B: POS[b], t: graph[a][b][0], f: graph[a][b][1] })))
const onSet = computed(() => {
  const p = props.path || []
  return new Set(p.slice(1).flatMap((v, i) => [`${p[i]}>${v}`, `${v}>${p[i]}`]))
})
const isOn = (a: string, b: string) => onSet.value.has(`${a}>${b}`)
</script>

<template>
  <svg viewBox="0 0 1000 580" style="width:100%;height:auto" role="img" aria-label="แผนที่เส้นทางเรือ">
    <g v-for="e in edges" :key="e.a + e.b">
      <line :x1="e.A[0]" :y1="e.A[1]" :x2="e.B[0]" :y2="e.B[1]" :stroke="isOn(e.a, e.b) ? '#c07a4a' : '#b9c4b4'" :stroke-width="isOn(e.a, e.b) ? 5 : 1.5" stroke-linecap="round" />
      <text :x="(e.A[0] + e.B[0]) / 2" :y="(e.A[1] + e.B[1]) / 2 - 5" font-size="12" text-anchor="middle" :fill="isOn(e.a, e.b) ? '#c07a4a' : '#6a7b6f'" :font-weight="isOn(e.a, e.b) ? 700 : 400" paint-order="stroke" stroke="#f4f1e6" stroke-width="4">{{ e.t }}น. ฿{{ e.f }}</text>
    </g>
    <g v-for="[v, p] in Object.entries(POS)" :key="v">
      <circle :cx="p[0]" :cy="p[1]" r="17" :fill="mark?.[v] ? '#3f8f8a' : path?.includes(v) ? '#c07a4a' : '#2f6b4f'" stroke="#fffdf7" stroke-width="2" />
      <text :x="p[0]" :y="p[1] + 4" :font-size="(mark?.[v] || '').length > 1 ? 10 : 13" fill="#fff" text-anchor="middle" font-weight="700">{{ mark?.[v] || '' }}</text>
      <text :x="p[0]" :y="p[1] - 24" font-size="14" text-anchor="middle" font-weight="700" fill="#243a2f" paint-order="stroke" stroke="#f4f1e6" stroke-width="4">{{ LABEL[v] }}</text>
    </g>
  </svg>
</template>
