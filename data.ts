// ===== GRAPH: กราฟถ่วงน้ำหนักแบบไม่มีทิศทาง (Adjacency List) =====
// Vertex = เกาะ/ท่าเรือ, Edge = เส้นทางเรือตรง, Weight = [เวลา(นาที), ค่าเรือ(บาท)]  (ข้อมูลจำลอง)
export type Weight = [number, number]
export const graph: Record<string, Record<string, Weight>> = {
  Phuket:   { PhiPhi: [120, 450], KohYao: [50, 200], Krabi: [100, 500] },
  KohYao:   { Phuket: [50, 200], Krabi: [70, 150], PhiPhi: [90, 300] },
  Krabi:    { Phuket: [100, 500], KohYao: [70, 150], PhiPhi: [90, 350], KohLanta: [120, 400] },
  PhiPhi:   { Phuket: [120, 450], KohYao: [90, 300], Krabi: [90, 350], KohLanta: [100, 350] },
  KohLanta: { Krabi: [120, 400], PhiPhi: [100, 350], KohMook: [140, 500] },
  KohMook:  { KohLanta: [140, 500], Trang: [45, 200], KohLipe: [180, 700] },
  Trang:    { KohMook: [45, 200], PakBara: [100, 250] },
  PakBara:  { Trang: [100, 250], KohLipe: [90, 600] },
  KohLipe:  { PakBara: [90, 600], KohMook: [180, 700] }
}
export const LABEL: Record<string, string> = { Phuket: 'ภูเก็ต', KohYao: 'เกาะยาว', Krabi: 'กระบี่', PhiPhi: 'เกาะพีพี', KohLanta: 'เกาะลันตา', KohMook: 'เกาะมุก', Trang: 'ตรัง', PakBara: 'ปากบารา', KohLipe: 'เกาะหลีเป๊ะ' }
export const POS: Record<string, [number, number]> = { Phuket: [90, 180], KohYao: [260, 90], Krabi: [470, 120], PhiPhi: [300, 290], KohLanta: [480, 330], KohMook: [640, 470], Trang: [740, 260], PakBara: [880, 360], KohLipe: [830, 530] }
export const COST: Record<string, (e: Weight) => number> = { time: e => e[0], fare: e => e[1], mix: e => e[0] + e[1] / 5 }
export const MODE: Record<string, string> = { time: 'เร็วที่สุด', fare: 'ประหยัดที่สุด', mix: 'สมดุล' }

// ===== TREE: ทริปอันดามัน (Root) -> โซน -> เกาะ -> กิจกรรม (Leaf) =====
export interface TreeNode { name: string; children?: TreeNode[]; v?: string; parent: TreeNode | null; level: number }
const N = (name: string, children?: TreeNode[], v?: string): TreeNode => ({ name, children, v, parent: null, level: 0 })
export const tree: TreeNode = N('ทริปอันดามัน', [
  N('อันดามันเหนือ', [
    N('ภูเก็ต', [N('เดินเมืองเก่าภูเก็ต'), N('ชมพระอาทิตย์ตกแหลมพรหมเทพ')], 'Phuket'),
    N('เกาะยาว', [N('ปั่นจักรยานชมหมู่บ้าน'), N('พายเรือคายัค')], 'KohYao')]),
  N('โซนกระบี่', [
    N('กระบี่', [N('ทัวร์ 4 เกาะ'), N('เที่ยวสระมรกต')], 'Krabi'),
    N('เกาะพีพี', [N('ดำน้ำตื้นอ่าวมาหยา'), N('เดินขึ้นจุดชมวิว')], 'PhiPhi')]),
  N('อันดามันใต้', [
    N('เกาะลันตา', [N('พายคายัคป่าชายเลน'), N('คาเฟ่เมืองเก่าลันตา')], 'KohLanta'),
    N('เกาะมุก', [N('ว่ายน้ำถ้ำมรกต'), N('นั่งเรือหางยาวชมพระอาทิตย์ตก')], 'KohMook'),
    N('เกาะหลีเป๊ะ', [N('เดินถนนคนเดิน'), N('ดำน้ำลึก')], 'KohLipe')])
])
export const kids = (n: TreeNode): TreeNode[] => n.children || []   // ไม่มี children = Leaf
;(function annotate(n: TreeNode, p: TreeNode | null, l: number) { n.parent = p; n.level = l; kids(n).forEach(c => annotate(c, n, l + 1)) })(tree, null, 0)
export const leavesOf = (n: TreeNode): TreeNode[] => kids(n).length ? kids(n).flatMap(leavesOf) : [n]
export const ISLANDS: TreeNode[] = []
;(function w(n: TreeNode) { if (n.level === 2) ISLANDS.push(n); kids(n).forEach(w) })(tree)
export const findLeaf = (name: string) => leavesOf(tree).find(l => l.name === name)
export const islandOf = (leaf: TreeNode) => leaf.parent!.v!

// ===== ALGORITHMS =====
export function dijkstra(g: typeof graph, s: string, fn: (e: Weight) => number) {
  const d: Record<string, number> = {}, prev: Record<string, string> = {}, Q = new Set(Object.keys(g))
  Q.forEach(v => d[v] = Infinity); d[s] = 0
  while (Q.size) {
    let u: string | null = null
    Q.forEach(v => { if (u === null || d[v] < d[u]) u = v })
    if (u === null || d[u] === Infinity) break
    Q.delete(u)
    for (const v in g[u]) { const alt = d[u] + fn(g[u][v]); if (alt < d[v]) { d[v] = alt; prev[v] = u } }
  }
  return { d, prev }
}
export const pathOf = (prev: Record<string, string>, t: string) => { const p = [t]; while (prev[p[0]]) p.unshift(prev[p[0]]); return p }
export const legs = (p: string[]) => p.slice(1).map((v, i) => ({ from: p[i], to: v, t: graph[p[i]][v][0], f: graph[p[i]][v][1] }))
export const totals = (p: string[]) => { const L = legs(p); return { t: L.reduce((a, l) => a + l.t, 0), f: L.reduce((a, l) => a + l.f, 0), n: L.length } }
const perms = <T>(a: T[]): T[][] => a.length < 2 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map(p => [x, ...p]))
// ลองทุกลำดับการแวะ แล้วเลือกลำดับที่ต้นทุนรวมต่ำสุด
export function bestTrip(start: string, stops: string[], mode: string) {
  const fn = COST[mode] || COST.time, D: Record<string, ReturnType<typeof dijkstra>> = {}
  ;[start, ...stops].forEach(s => D[s] = dijkstra(graph, s, fn))
  let best: { order: string[]; cost: number } | null = null
  perms(stops).forEach(o => {
    const seq = [start, ...o]; let c = 0
    seq.slice(1).forEach((v, i) => c += D[seq[i]].d[v])
    if (!best || c < best.cost) best = { order: seq, cost: c }
  })
  const order = best!.order, path = [start]
  order.slice(1).forEach((v, i) => path.push(...pathOf(D[order[i]].prev, v).slice(1)))
  return { order, path, cost: best!.cost }
}
// เกาะที่ไปถึงได้ภายใน 1, 2 ต่อเรือ (BFS)
export function bfsLevels(g: typeof graph, s: string, max = 2) {
  const seen = new Set([s]); let cur = [s]; const out: string[][] = []
  for (let i = 0; i < max; i++) { const nx: string[] = []; cur.forEach(u => { for (const v in g[u]) if (!seen.has(v)) { seen.add(v); nx.push(v) } }); out.push(nx); cur = nx }
  return out
}

// ===== ตัวช่วยทั่วไป =====
export const dur = (m: number) => (m >= 60 ? Math.floor(m / 60) + ' ชม. ' : '') + (m % 60 ? (m % 60) + ' นาที' : '')
export const hm = (m: number) => String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0')
export const qstr = (v: any): string => Array.isArray(v) ? String(v[0] ?? '') : String(v ?? '')
export const qlist = (v: any): string[] => qstr(v).split(',').filter(Boolean)
