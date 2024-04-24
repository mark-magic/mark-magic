export function isChineseOrSymbol(s: string): boolean {
  if (/[\u4E00-\u9FFF]/.test(s)) {
    return true
  }
  return /[\u4E00-\u9FFF]/.test(s) || '，。、；：？！“”‘’（）【】《》—～…·〃-々'.split('').includes(s)
}

export const STRONG_CASE = [
  [`**真，** 她`, '<p><strong>真，</strong>她</p>'],
  [`**真。** 她`, '<p><strong>真。</strong>她</p>'],
  [`**真、** 她`, '<p><strong>真、</strong>她</p>'],
  [`**真；** 她`, '<p><strong>真；</strong>她</p>'],
  [`**真：** 她`, '<p><strong>真：</strong>她</p>'],
  [`**真？** 她`, '<p><strong>真？</strong>她</p>'],
  [`**真！** 她`, '<p><strong>真！</strong>她</p>'],
  [`**真“** 她`, '<p><strong>真“</strong>她</p>'],
  [`**真”** 她`, '<p><strong>真”</strong>她</p>'],
  [`**真‘** 她`, '<p><strong>真‘</strong>她</p>'],
  [`**真’** 她`, '<p><strong>真’</strong>她</p>'],
  [`**真（** 她`, '<p><strong>真（</strong>她</p>'],
  [`**真）** 她`, '<p><strong>真）</strong>她</p>'],
  [`**真【** 她`, '<p><strong>真【</strong>她</p>'],
  [`**真】** 她`, '<p><strong>真】</strong>她</p>'],
  [`**真《** 她`, '<p><strong>真《</strong>她</p>'],
  [`**真》** 她`, '<p><strong>真》</strong>她</p>'],
  [`**真—** 她`, '<p><strong>真—</strong>她</p>'],
  [`**真～** 她`, '<p><strong>真～</strong>她</p>'],
  [`**真…** 她`, '<p><strong>真…</strong>她</p>'],
  [`**真·** 她`, '<p><strong>真·</strong>她</p>'],
  [`**真〃** 她`, '<p><strong>真〃</strong>她</p>'],
  [`**真-** 她`, '<p><strong>真-</strong>她</p>'],
  [`**真々** 她`, '<p><strong>真々</strong>她</p>'],
  [`**真** 她`, '<p><strong>真</strong>她</p>'],
  [`她 **真**`, '<p>她<strong>真</strong></p>'],
]

export const ITALIC_CASE = [
  [`*真，* 她`, '<p><em>真，</em>她</p>'],
  [`*真。* 她`, '<p><em>真。</em>她</p>'],
  [`*真、* 她`, '<p><em>真、</em>她</p>'],
  [`*真；* 她`, '<p><em>真；</em>她</p>'],
  [`*真：* 她`, '<p><em>真：</em>她</p>'],
  [`*真？* 她`, '<p><em>真？</em>她</p>'],
  [`*真！* 她`, '<p><em>真！</em>她</p>'],
  [`*真“* 她`, '<p><em>真“</em>她</p>'],
  [`*真”* 她`, '<p><em>真”</em>她</p>'],
  [`*真‘* 她`, '<p><em>真‘</em>她</p>'],
  [`*真’* 她`, '<p><em>真’</em>她</p>'],
  [`*真（* 她`, '<p><em>真（</em>她</p>'],
  [`*真）* 她`, '<p><em>真）</em>她</p>'],
  [`*真【* 她`, '<p><em>真【</em>她</p>'],
  [`*真】* 她`, '<p><em>真】</em>她</p>'],
  [`*真《* 她`, '<p><em>真《</em>她</p>'],
  [`*真》* 她`, '<p><em>真》</em>她</p>'],
  [`*真—* 她`, '<p><em>真—</em>她</p>'],
  [`*真～* 她`, '<p><em>真～</em>她</p>'],
  [`*真…* 她`, '<p><em>真…</em>她</p>'],
  [`*真·* 她`, '<p><em>真·</em>她</p>'],
  [`*真〃* 她`, '<p><em>真〃</em>她</p>'],
  [`*真-* 她`, '<p><em>真-</em>她</p>'],
  [`*真々* 她`, '<p><em>真々</em>她</p>'],
  [`*真* 她`, '<p><em>真</em>她</p>'],
  [`她 *真*`, '<p>她<em>真</em></p>'],
]
