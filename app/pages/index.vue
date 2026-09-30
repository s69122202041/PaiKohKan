<script setup lang="ts">
const route = useRoute()
const P = ref<TreeNode[]>([tree])                       // Path จาก Root ถึงโหนดปัจจุบัน
const sel = ref<string[]>(qlist(route.query.acts).filter(a => findLeaf(a)))
const cur = computed(() => P.value[P.value.length - 1] ?? tree)
const back = (i: number) => { P.value = P.value.slice(0, i + 1) }
const tog = (a: string) => { sel.value = sel.value.includes(a) ? sel.value.filter(x => x !== a) : [...sel.value, a] }
</script>

<template>
  <div>
    <section class="hero">
      <h1>เลือกทริปเกาะอันดามันที่คุณต้องการได้</h1>
      <p>เลือกกิจกรรมที่ชอบ แล้วเราจะจัดลำดับเกาะและเรือให้เหมาะกับคุณ</p>
    </section>
    <div class="g2">
      <section class="card">
        <div class="crumb">
          <template v-for="(x, i) in P" :key="x.name">
            <span v-if="i">›</span>
            <button class="alt" @click="back(i)">{{ i ? x.name : 'ทั้งหมด' }}</button>
          </template>
        </div>
        <div class="tiles">
          <template v-for="c in kids(cur)" :key="c.name">
            <button v-if="kids(c).length" class="tile" @click="P.push(c)">
              <span><b>{{ c.name }}</b><small>{{ leavesOf(c).length }} กิจกรรม</small></span>
            </button>
            <label v-else class="tile">
              <input type="checkbox" :checked="sel.includes(c.name)" @change="tog(c.name)">
              <span><b>{{ c.name }}</b><small>ที่{{ c.parent?.name }}</small></span>
            </label>
          </template>
        </div>
      </section>
      <aside class="card">
        <h3>ทริปของฉัน</h3>
        <p v-if="!sel.length" class="mut">ยังไม่ได้เลือกกิจกรรม กดเลือกจากรายการทางซ้ายได้เลย</p>
        <div v-for="a in sel" :key="a" class="row" style="justify-content:space-between">
          <span>{{ a }}<br><small class="mut">{{ findLeaf(a)?.parent?.name }}</small></span>
          <button class="alt" @click="tog(a)">ลบ</button>
        </div>
        <NuxtLink v-if="sel.length" class="btn" :to="{ path: '/roadmap', query: { acts: sel.join(',') } }">จัดเส้นทางทริปนี้</NuxtLink>
      </aside>
    </div>
  </div>
</template>
