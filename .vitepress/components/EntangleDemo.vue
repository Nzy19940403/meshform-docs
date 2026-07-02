<template>
  <div class="entangle-demo">
    <div class="ed-header">
      <span class="ed-badge">useEntangle</span>
      <span class="ed-title">{{ copy.title }}</span>
      <span class="ed-desc">{{ copy.desc }}</span>
    </div>

    <div class="ed-currencies">
      <div class="currency-card" :class="{ flash: isFlashing('cny') }">
        <div class="cc-flag">CN</div>
        <div class="cc-name">{{ copy.currencies.cny }} <span class="cc-code">CNY</span></div>
        <div class="stepper-wrap">
          <button class="step-btn" @click="step('cny', -100)">-</button>
          <input type="number" :value="cny" class="cc-input" min="0" step="100" @input="onChange('cny', +($event.target as HTMLInputElement).value)" />
          <button class="step-btn" @click="step('cny', 100)">+</button>
        </div>
        <div class="cc-rate">1 CNY = {{ fmtRate(1 / CNY_PER_USD) }} USD = {{ fmtRate(1 / CNY_PER_EUR) }} EUR</div>
      </div>

      <div class="cc-arrows">
        <div class="arrow-row"><span class="arr arr-right" :class="{ lit: lastChanged === 'cny' }">></span></div>
        <div class="arrow-row"><span class="arr arr-left" :class="{ lit: lastChanged === 'usd' || lastChanged === 'eur' }"><</span></div>
      </div>

      <div class="currency-card" :class="{ flash: isFlashing('usd') }">
        <div class="cc-flag">US</div>
        <div class="cc-name">{{ copy.currencies.usd }} <span class="cc-code">USD</span></div>
        <div class="stepper-wrap">
          <button class="step-btn" @click="step('usd', -10)">-</button>
          <input type="number" :value="usd" class="cc-input" min="0" step="10" @input="onChange('usd', +($event.target as HTMLInputElement).value)" />
          <button class="step-btn" @click="step('usd', 10)">+</button>
        </div>
        <div class="cc-rate">1 USD = {{ fmtRate(CNY_PER_USD) }} CNY = {{ fmtRate(CNY_PER_USD / CNY_PER_EUR) }} EUR</div>
      </div>

      <div class="cc-arrows">
        <div class="arrow-row"><span class="arr arr-right" :class="{ lit: lastChanged === 'cny' || lastChanged === 'usd' }">></span></div>
        <div class="arrow-row"><span class="arr arr-left" :class="{ lit: lastChanged === 'eur' }"><</span></div>
      </div>

      <div class="currency-card" :class="{ flash: isFlashing('eur') }">
        <div class="cc-flag">EU</div>
        <div class="cc-name">{{ copy.currencies.eur }} <span class="cc-code">EUR</span></div>
        <div class="stepper-wrap">
          <button class="step-btn" @click="step('eur', -10)">-</button>
          <input type="number" :value="eur" class="cc-input" min="0" step="10" @input="onChange('eur', +($event.target as HTMLInputElement).value)" />
          <button class="step-btn" @click="step('eur', 10)">+</button>
        </div>
        <div class="cc-rate">1 EUR = {{ fmtRate(CNY_PER_EUR) }} CNY = {{ fmtRate(CNY_PER_EUR / CNY_PER_USD) }} USD</div>
      </div>
    </div>

    <div class="ed-explain">
      <div class="explain-item">
        <div class="ei-label">{{ copy.explain.loopTitle }}</div>
        <div class="ei-body">{{ copy.explain.loopBody }}</div>
      </div>
      <div class="explain-item">
        <div class="ei-label">{{ copy.explain.watchTitle }}</div>
        <div class="ei-body">{{ copy.explain.watchBody }}</div>
      </div>
      <div class="explain-item">
        <div class="ei-label">{{ copy.explain.engineTitle }}</div>
        <div class="ei-body">{{ copy.explain.engineBody }}</div>
      </div>
    </div>

    <div class="ed-code">
      <div class="code-header">{{ copy.codeTitle }}</div>
      <pre class="code-body">{{ codeExample }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type Field = 'cny' | 'usd' | 'eur'

const props = withDefaults(defineProps<{ en?: boolean }>(), {
  en: false,
})

const copyMap = {
  zh: {
    title: '货币换算 · 三向纠缠',
    desc: '修改任意一个金额，其余两个会立即收敛。',
    currencies: { cny: '人民币', usd: '美元', eur: '欧元' },
    explain: {
      loopTitle: '为什么叫“纠缠”',
      loopBody: '三个字段之间存在有环依赖。它们没有固定的上游和下游，因果关系是对称的。',
      watchTitle: '如果用 watch 会怎样',
      watchBody: '改一个字段会触发另外两个 watcher，稍不小心就进入反复回写和死循环。',
      engineTitle: 'useEntangle 做了什么',
      engineBody: '每次更新都以“提案 + 收敛”的方式传播，只有差量超过阈值时才继续推进。',
    },
    codeTitle: '对应的 useEntangle 注册代码',
    codeLines: [
      "// 注册 CNY -> USD 纠缠（反向同理）",
      'engine.entangle({',
      "  cause: 'amount.cny', impact: 'amount.usd', via: ['value'],",
      '  emit: (cny, usd) => {',
      '    const target = cny.value / CNY_PER_USD',
      '    const diff = target - usd.value',
      '    if (Math.abs(diff) < 0.001) return',
      "    return { key: 'value', delta: diff }",
      '  },',
      '})',
      '',
      '// CNY -> EUR、USD -> EUR 继续注册',
      '// 引擎保证有环传播最终收敛，而不是陷入互相回写。',
    ],
  },
  en: {
    title: 'Currency Conversion · Three-way entangle',
    desc: 'Edit any one amount and the other two converge immediately.',
    currencies: { cny: 'Chinese yuan', usd: 'US dollar', eur: 'Euro' },
    explain: {
      loopTitle: 'Why call it entangle',
      loopBody: 'These three fields form a cyclic dependency. There is no permanent upstream node because the relationship is symmetric.',
      watchTitle: 'What goes wrong with watchers',
      watchBody: 'A change in one field triggers two more writes, which trigger more watchers, and soon you are fighting feedback loops and guards.',
      engineTitle: 'What useEntangle does',
      engineBody: 'Each update propagates as a proposal and only keeps moving while the remaining delta is meaningful enough to continue.',
    },
    codeTitle: 'Matching useEntangle registration',
    codeLines: [
      '// Register the CNY -> USD entangle (and the reverse pair separately)',
      'engine.entangle({',
      "  cause: 'amount.cny', impact: 'amount.usd', via: ['value'],",
      '  emit: (cny, usd) => {',
      '    const target = cny.value / CNY_PER_USD',
      '    const diff = target - usd.value',
      '    if (Math.abs(diff) < 0.001) return',
      "    return { key: 'value', delta: diff }",
      '  },',
      '})',
      '',
      '// Register CNY -> EUR and USD -> EUR as well.',
      '// The engine guarantees cyclic propagation converges instead of bouncing forever.',
    ],
  },
} as const

const copy = computed(() => (props.en ? copyMap.en : copyMap.zh))
const codeExample = computed(() => copy.value.codeLines.join('\n'))
const CNY_PER_USD = 7.24
const CNY_PER_EUR = 7.85

const cny = ref(724)
const usd = ref(100)
const eur = ref(92.23)
const lastChanged = ref<Field | ''>('')
const flashFields = ref<Field[]>([])
let flashTimer: ReturnType<typeof setTimeout> | null = null

function onChange(field: Field, value: number) {
  if (Number.isNaN(value) || value < 0) return
  lastChanged.value = field

  if (field === 'cny') {
    cny.value = value
    usd.value = r2(value / CNY_PER_USD)
    eur.value = r2(value / CNY_PER_EUR)
    triggerFlash('usd', 'eur')
    return
  }

  if (field === 'usd') {
    usd.value = value
    cny.value = r2(value * CNY_PER_USD)
    eur.value = r2(value * CNY_PER_USD / CNY_PER_EUR)
    triggerFlash('cny', 'eur')
    return
  }

  eur.value = value
  cny.value = r2(value * CNY_PER_EUR)
  usd.value = r2(value * CNY_PER_EUR / CNY_PER_USD)
  triggerFlash('cny', 'usd')
}

function step(field: Field, delta: number) {
  const current = field === 'cny' ? cny.value : field === 'usd' ? usd.value : eur.value
  onChange(field, Math.max(0, r2(current + delta)))
}

function triggerFlash(...fields: Field[]) {
  flashFields.value = []
  if (flashTimer) clearTimeout(flashTimer)
  flashTimer = setTimeout(() => {
    flashFields.value = fields
    setTimeout(() => {
      flashFields.value = []
    }, 700)
  }, 10)
}

function isFlashing(field: Field) {
  return flashFields.value.includes(field)
}

function r2(value: number) {
  return Math.round(value * 100) / 100
}

function fmtRate(value: number) {
  return value.toFixed(4)
}
</script>

<style scoped>
.entangle-demo {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 14px;
  overflow: hidden;
  margin: 24px 0;
  font-size: 13px;
}
.ed-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 20px;
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  flex-wrap: wrap;
}
.ed-badge {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  font-family: 'JetBrains Mono', monospace;
}
.ed-title { font-size: 14px; font-weight: 700; color: var(--vp-c-text-1); }
.ed-desc { font-size: 11px; color: var(--vp-c-text-2); margin-left: auto; }
.ed-currencies {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 24px 20px;
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  flex-wrap: wrap;
  justify-content: center;
}
@media (max-width: 640px) {
  .ed-currencies { flex-direction: column; gap: 12px; }
  .cc-arrows { transform: rotate(90deg); }
}
.currency-card {
  flex: 1;
  min-width: 160px;
  max-width: 220px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: border-color .2s, box-shadow .2s;
}
@keyframes card-flash {
  0% { border-color: #a78bfa; box-shadow: 0 0 0 0 rgba(167, 139, 250, .5); }
  50% { border-color: #a78bfa; box-shadow: 0 0 0 8px rgba(167, 139, 250, 0); }
  100% { border-color: var(--vp-c-border); box-shadow: none; }
}
.currency-card.flash { animation: card-flash .6s ease forwards; }
.cc-flag { font-size: 12px; font-weight: 700; letter-spacing: 0.08em; color: var(--vp-c-text-2); }
.cc-name { font-size: 13px; font-weight: 700; color: var(--vp-c-text-1); }
.cc-code { font-size: 10px; font-family: 'JetBrains Mono', monospace; color: var(--vp-c-text-2); margin-left: 4px; font-weight: 400; }
.stepper-wrap { display: flex; align-items: stretch; }
.step-btn {
  width: 30px;
  flex-shrink: 0;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  transition: all .15s;
}
.step-btn:first-child { border-radius: 6px 0 0 6px; border-right: none; }
.step-btn:last-child { border-radius: 0 6px 6px 0; border-left: none; }
.step-btn:hover { background: rgba(139, 92, 246, .15); border-color: #8b5cf6; color: #a78bfa; }
.cc-input {
  flex: 1;
  min-width: 0;
  padding: 8px 6px;
  border: 1px solid var(--vp-c-border);
  border-radius: 0;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 18px;
  font-weight: 800;
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
  outline: none;
  box-sizing: border-box;
  transition: border-color .15s;
}
.cc-input:focus { border-color: #8b5cf6; }
.cc-rate { font-size: 9px; color: var(--vp-c-text-2); font-family: 'JetBrains Mono', monospace; }
.cc-arrows { display: flex; flex-direction: column; gap: 6px; align-items: center; padding: 0 8px; flex-shrink: 0; }
.arrow-row { display: flex; }
.arr { font-size: 18px; font-weight: 700; color: var(--vp-c-border); transition: color .2s, text-shadow .2s; font-family: monospace; }
.arr.lit { color: #a78bfa; text-shadow: 0 0 8px rgba(167, 139, 250, .6); }
.ed-explain { display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid var(--vp-c-border); }
@media (max-width: 640px) {
  .ed-explain { grid-template-columns: 1fr; }
}
.explain-item { padding: 14px 18px; border-right: 1px solid var(--vp-c-border); font-size: 12px; line-height: 1.6; }
.explain-item:last-child { border-right: none; }
.ei-label { font-weight: 700; margin-bottom: 6px; color: var(--vp-c-text-1); }
.ei-body { color: var(--vp-c-text-2); }
.ed-code { background: var(--vp-c-bg); }
.code-header { padding: 8px 18px; font-size: 11px; font-weight: 600; color: var(--vp-c-text-2); border-bottom: 1px solid var(--vp-c-border); }
.code-body {
  margin: 0;
  padding: 14px 18px;
  font-size: 11px;
  line-height: 1.7;
  font-family: 'JetBrains Mono', monospace;
  color: var(--vp-c-text-1);
  overflow-x: auto;
  white-space: pre;
}
</style>