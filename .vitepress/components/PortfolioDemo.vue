<template>
  <div class="portfolio-demo">
    <div class="pd-header">
      <span class="badge-ent">useEntangle</span>
      <span class="badge-dag">from / define</span>
      <span class="pd-title">{{ copy.title }}</span>
      <span class="pd-desc">{{ copy.desc }}</span>
    </div>

    <div class="pd-total-bar">
      <span class="total-label">{{ copy.totalCapital }}</span>
      <div class="stepper-wrap">
        <button class="step-btn" @click="adjustTotal(-100000)">-</button>
        <input v-model.number="total" type="number" step="100000" min="100000" class="total-input" />
        <button class="step-btn" @click="adjustTotal(100000)">+</button>
      </div>
      <span class="total-value">{{ copy.currency }} {{ fmt(total) }}</span>
    </div>

    <div class="alloc-bar-wrap">
      <div class="alloc-bar">
        <div class="ab-seg ab-stock" :style="{ width: stockPct + '%' }"><span v-if="stockPct >= 8">S {{ stockPct }}%</span></div>
        <div class="ab-seg ab-bond" :style="{ width: bondPct + '%' }"><span v-if="bondPct >= 8">B {{ bondPct }}%</span></div>
        <div class="ab-seg ab-cash" :style="{ width: cashPct + '%' }"><span v-if="cashPct >= 8">C {{ cashPct }}%</span></div>
      </div>
      <div class="bar-legend">
        <span class="bl-item stock">■ {{ copy.assets.stock.name }}</span>
        <span class="bl-item bond">■ {{ copy.assets.bond.name }}</span>
        <span class="bl-item cash">■ {{ copy.assets.cash.name }}</span>
        <span class="bl-constraint">{{ copy.constraint }}</span>
      </div>
    </div>

    <div class="pd-rows">
      <div class="pd-row" :class="{ flash: flashSet.has('stock') }">
        <div class="row-icon">S</div>
        <div class="row-name">{{ copy.assets.stock.name }}</div>
        <div class="row-slider-group">
          <input type="range" min="0" max="100" step="1" :value="stockPct" @input="onPctChange('stock', +($event.target as HTMLInputElement).value)" class="row-slider slider-stock" />
          <div class="pct-input-wrap">
            <input type="number" min="0" max="100" step="1" :value="stockPct" @change="onPctChange('stock', +($event.target as HTMLInputElement).value)" class="pct-input" />
            <span class="pct-sym">%</span>
          </div>
        </div>
        <div class="row-dag-arrow"><span class="dag-label">DAG</span></div>
        <div class="row-computed">
          <div class="comp-amt">{{ copy.currency }} {{ fmt(stockAmt) }}</div>
          <div class="comp-rate stock-rate">{{ copy.assets.stock.rateLabel }}</div>
          <div class="comp-ret stock-ret">+{{ copy.currency }} {{ fmt(stockRet) }} / {{ copy.perYear }}</div>
        </div>
      </div>

      <div class="pd-row" :class="{ flash: flashSet.has('bond') }">
        <div class="row-icon">B</div>
        <div class="row-name">{{ copy.assets.bond.name }}</div>
        <div class="row-slider-group">
          <input type="range" min="0" max="100" step="1" :value="bondPct" @input="onPctChange('bond', +($event.target as HTMLInputElement).value)" class="row-slider slider-bond" />
          <div class="pct-input-wrap">
            <input type="number" min="0" max="100" step="1" :value="bondPct" @change="onPctChange('bond', +($event.target as HTMLInputElement).value)" class="pct-input" />
            <span class="pct-sym">%</span>
          </div>
        </div>
        <div class="row-dag-arrow"><span class="dag-label">DAG</span></div>
        <div class="row-computed">
          <div class="comp-amt">{{ copy.currency }} {{ fmt(bondAmt) }}</div>
          <div class="comp-rate bond-rate">{{ copy.assets.bond.rateLabel }}</div>
          <div class="comp-ret bond-ret">+{{ copy.currency }} {{ fmt(bondRet) }} / {{ copy.perYear }}</div>
        </div>
      </div>

      <div class="pd-row" :class="{ flash: flashSet.has('cash') }">
        <div class="row-icon">C</div>
        <div class="row-name">{{ copy.assets.cash.name }}</div>
        <div class="row-slider-group">
          <input type="range" min="0" max="100" step="1" :value="cashPct" @input="onPctChange('cash', +($event.target as HTMLInputElement).value)" class="row-slider slider-cash" />
          <div class="pct-input-wrap">
            <input type="number" min="0" max="100" step="1" :value="cashPct" @change="onPctChange('cash', +($event.target as HTMLInputElement).value)" class="pct-input" />
            <span class="pct-sym">%</span>
          </div>
        </div>
        <div class="row-dag-arrow"><span class="dag-label">DAG</span></div>
        <div class="row-computed">
          <div class="comp-amt">{{ copy.currency }} {{ fmt(cashAmt) }}</div>
          <div class="comp-rate cash-rate">{{ copy.assets.cash.rateLabel }}</div>
          <div class="comp-ret cash-ret">+{{ copy.currency }} {{ fmt(cashRet) }} / {{ copy.perYear }}</div>
        </div>
      </div>
    </div>

    <div class="pd-summary">
      <div class="sum-grid">
        <div class="sum-item">
          <div class="si-label">{{ copy.totalCapital }}</div>
          <div class="si-value">{{ copy.currency }} {{ fmt(total) }}</div>
        </div>
        <div class="sum-divider">></div>
        <div class="sum-item">
          <div class="si-label">{{ copy.expectedReturn }}</div>
          <div class="si-value highlight">{{ copy.currency }} {{ fmt(totalRet) }}</div>
        </div>
        <div class="sum-divider">=</div>
        <div class="sum-item">
          <div class="si-label">{{ copy.effectiveRate }}</div>
          <div class="si-value rate">{{ effectiveRate }}%</div>
        </div>
      </div>
    </div>

    <div class="pd-legend">
      <div class="leg-section">
        <div class="leg-section-title">{{ copy.ruleTitle }}</div>
        <div class="leg-rules">
          <div class="rule-item"><span class="rule-trigger stock-c">{{ copy.ruleTriggers.stock }}</span><span class="rule-arrow">></span><span class="rule-desc">{{ copy.ruleBodies.stock }}</span></div>
          <div class="rule-item"><span class="rule-trigger bond-c">{{ copy.ruleTriggers.bond }}</span><span class="rule-arrow">></span><span class="rule-desc">{{ copy.ruleBodies.bond }}</span></div>
          <div class="rule-item"><span class="rule-trigger cash-c">{{ copy.ruleTriggers.cash }}</span><span class="rule-arrow">></span><span class="rule-desc">{{ copy.ruleBodies.cash }}</span></div>
        </div>
      </div>
      <div class="leg-item"><span class="leg-dot dag"></span><span>{{ copy.dagSummary }}</span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type Field = 'stock' | 'bond' | 'cash'

const props = withDefaults(defineProps<{ en?: boolean }>(), {
  en: false,
})

const copyMap = {
  zh: {
    title: '资产配置模拟器',
    desc: '三比例纠缠 + 金额和收益 DAG 推导。',
    totalCapital: '总资金',
    currency: 'CNY',
    perYear: '年',
    constraint: '三者之和始终 = 100%',
    expectedReturn: '预期年收益',
    effectiveRate: '综合年化',
    ruleTitle: 'useEntangle · 比例约束规则',
    ruleTriggers: { stock: '调整股票%', bond: '调整债券%', cash: '调整现金%' },
    ruleBodies: {
      stock: '债券优先承担差额；债券触底后，现金继续补位。',
      bond: '股票优先承担差额；股票触底后，现金继续补位。',
      cash: '剩余比例按照当前股票/债券权重重新分配。',
    },
    dagSummary: 'from / define 负责单向推导：资产金额 = 总资金 × 比例，收益 = 金额 × 年化利率，总收益为三个分支的汇总。',
    assets: {
      stock: { name: '股票', rateLabel: '年化 12%' },
      bond: { name: '债券', rateLabel: '年化 4%' },
      cash: { name: '现金', rateLabel: '年化 2%' },
    },
  },
  en: {
    title: 'Portfolio allocator',
    desc: 'Entangled percentages with DAG-derived amounts and returns.',
    totalCapital: 'Total capital',
    currency: 'CNY',
    perYear: 'year',
    constraint: 'The three allocations must always sum to 100%',
    expectedReturn: 'Expected annual return',
    effectiveRate: 'Blended annualized rate',
    ruleTitle: 'useEntangle · ratio constraints',
    ruleTriggers: { stock: 'Change stock %', bond: 'Change bond %', cash: 'Change cash %' },
    ruleBodies: {
      stock: 'Bonds absorb the difference first; cash only moves when bonds reach the floor.',
      bond: 'Stocks absorb the difference first; cash only moves when stocks reach the floor.',
      cash: 'The remaining ratio is redistributed across stocks and bonds using their current weight.',
    },
    dagSummary: 'from / define handles one-way derivation: asset amount = total capital × ratio, return = amount × annualized rate, and total return is the downstream aggregate.',
    assets: {
      stock: { name: 'Stock', rateLabel: 'Annualized 12%' },
      bond: { name: 'Bond', rateLabel: 'Annualized 4%' },
      cash: { name: 'Cash', rateLabel: 'Annualized 2%' },
    },
  },
} as const

const copy = computed(() => (props.en ? copyMap.en : copyMap.zh))
const total = ref(1000000)
const stockPct = ref(60)
const bondPct = ref(30)
const cashPct = ref(10)

const stockAmt = computed(() => Math.round(total.value * stockPct.value / 100))
const bondAmt = computed(() => Math.round(total.value * bondPct.value / 100))
const cashAmt = computed(() => Math.round(total.value * cashPct.value / 100))
const stockRet = computed(() => Math.round(stockAmt.value * 0.12))
const bondRet = computed(() => Math.round(bondAmt.value * 0.04))
const cashRet = computed(() => Math.round(cashAmt.value * 0.02))
const totalRet = computed(() => stockRet.value + bondRet.value + cashRet.value)
const effectiveRate = computed(() => (total.value > 0 ? (totalRet.value / total.value) * 100 : 0).toFixed(2))

const flashSet = ref(new Set<Field>())
let flashTimer: ReturnType<typeof setTimeout> | null = null

function onPctChange(field: Field, rawValue: number) {
  const value = Math.max(0, Math.min(100, Math.round(rawValue)))
  const remaining = 100 - value
  let adjusted: Field[] = []

  if (field === 'stock') {
    stockPct.value = value
    const cashNext = Math.min(cashPct.value, remaining)
    bondPct.value = remaining - cashNext
    cashPct.value = cashNext
    adjusted = ['bond', 'cash']
  } else if (field === 'bond') {
    bondPct.value = value
    const cashNext = Math.min(cashPct.value, remaining)
    stockPct.value = remaining - cashNext
    cashPct.value = cashNext
    adjusted = ['stock', 'cash']
  } else {
    cashPct.value = value
    const [stockNext, bondNext] = proportional(remaining, stockPct.value, bondPct.value)
    stockPct.value = stockNext
    bondPct.value = bondNext
    adjusted = ['stock', 'bond']
  }

  flashSet.value = new Set<Field>()
  if (flashTimer) clearTimeout(flashTimer)
  flashTimer = setTimeout(() => {
    flashSet.value = new Set(adjusted)
    setTimeout(() => {
      flashSet.value = new Set<Field>()
    }, 700)
  }, 10)
}

function proportional(totalValue: number, a: number, b: number): [number, number] {
  if (totalValue <= 0) return [0, 0]
  const sum = a + b
  if (sum === 0) {
    const half = Math.round(totalValue / 2)
    return [half, totalValue - half]
  }
  const first = Math.round(totalValue * a / sum)
  return [first, totalValue - first]
}

function adjustTotal(delta: number) {
  total.value = Math.max(100000, total.value + delta)
}

function fmt(value: number) {
  return value.toLocaleString(props.en ? 'en-US' : 'zh-CN')
}
</script>

<style scoped>
.portfolio-demo {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 14px;
  overflow: hidden;
  margin: 24px 0;
  font-size: 13px;
}
.pd-header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px 20px;
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
}
.badge-ent {
  font-size: 11px;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  padding: 2px 9px;
  border-radius: 20px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: #fff;
}
.badge-dag {
  font-size: 11px;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  padding: 2px 9px;
  border-radius: 20px;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  color: #fff;
}
.pd-title { font-size: 14px; font-weight: 700; color: var(--vp-c-text-1); }
.pd-desc { font-size: 11px; color: var(--vp-c-text-2); margin-left: auto; }
.pd-total-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 12px 20px;
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
}
.total-label { font-size: 13px; font-weight: 600; color: var(--vp-c-text-2); min-width: 48px; }
.stepper-wrap { display: flex; }
.step-btn {
  width: 32px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 16px;
  cursor: pointer;
  transition: all .15s;
}
.step-btn:first-child { border-radius: 6px 0 0 6px; border-right: none; }
.step-btn:last-child { border-radius: 0 6px 6px 0; border-left: none; }
.step-btn:hover { background: rgba(59, 130, 246, .15); border-color: #3b82f6; color: #60a5fa; }
.total-input {
  width: 130px;
  padding: 7px 10px;
  border: 1px solid var(--vp-c-border);
  border-radius: 0;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 15px;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  text-align: right;
}
.total-value { font-size: 15px; font-weight: 800; font-family: 'JetBrains Mono', monospace; color: #3b82f6; }
.alloc-bar-wrap { padding: 14px 20px; border-bottom: 1px solid var(--vp-c-border); }
.alloc-bar { height: 36px; border-radius: 8px; overflow: hidden; display: flex; width: 100%; transition: all .3s ease; }
.ab-seg { display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: rgba(255,255,255,.9); transition: width .3s ease; white-space: nowrap; overflow: hidden; }
.ab-stock { background: linear-gradient(90deg, #f59e0b, #d97706); }
.ab-bond { background: linear-gradient(90deg, #3b82f6, #2563eb); }
.ab-cash { background: linear-gradient(90deg, #10b981, #059669); }
.bar-legend { display: flex; align-items: center; gap: 14px; margin-top: 7px; font-size: 11px; flex-wrap: wrap; }
.bl-item { color: var(--vp-c-text-2); }
.bl-item.stock { color: #d97706; }
.bl-item.bond { color: #3b82f6; }
.bl-item.cash { color: #10b981; }
.bl-constraint { margin-left: auto; font-size: 10px; color: #a78bfa; font-weight: 600; }
.pd-rows { border-bottom: 1px solid var(--vp-c-border); }
@keyframes row-flash {
  0% { background: rgba(167,139,250,.18); }
  100% { background: transparent; }
}
.pd-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding: 12px 20px; border-bottom: 1px solid var(--vp-c-divider, var(--vp-c-border)); transition: background .15s; }
.pd-row:last-child { border-bottom: none; }
.pd-row.flash { animation: row-flash .7s ease forwards; }
.row-icon { font-size: 14px; font-weight: 700; flex-shrink: 0; }
.row-name { width: 50px; font-size: 12px; font-weight: 600; color: var(--vp-c-text-1); flex-shrink: 0; }
.row-slider-group { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 200px; }
.row-slider { flex: 1; height: 6px; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; border-radius: 3px; background: transparent; }
.slider-stock::-webkit-slider-runnable-track { height: 6px; border-radius: 3px; background: linear-gradient(90deg, #f59e0b, #d97706); }
.slider-bond::-webkit-slider-runnable-track { height: 6px; border-radius: 3px; background: linear-gradient(90deg, #3b82f6, #2563eb); }
.slider-cash::-webkit-slider-runnable-track { height: 6px; border-radius: 3px; background: linear-gradient(90deg, #10b981, #059669); }
.row-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; margin-top: -6px; cursor: pointer; border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.4); }
.slider-stock::-webkit-slider-thumb { background: #f59e0b; }
.slider-bond::-webkit-slider-thumb { background: #3b82f6; }
.slider-cash::-webkit-slider-thumb { background: #10b981; }
.slider-stock::-moz-range-track { height: 6px; border-radius: 3px; border: none; background: linear-gradient(90deg, #f59e0b, #d97706); }
.slider-bond::-moz-range-track { height: 6px; border-radius: 3px; border: none; background: linear-gradient(90deg, #3b82f6, #2563eb); }
.slider-cash::-moz-range-track { height: 6px; border-radius: 3px; border: none; background: linear-gradient(90deg, #10b981, #059669); }
.row-slider::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; cursor: pointer; border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.4); }
.slider-stock::-moz-range-thumb { background: #f59e0b; }
.slider-bond::-moz-range-thumb { background: #3b82f6; }
.slider-cash::-moz-range-thumb { background: #10b981; }
.pct-input-wrap { display: flex; align-items: center; gap: 2px; flex-shrink: 0; }
.pct-input { width: 50px; padding: 4px 6px; border: 1px solid var(--vp-c-border); border-radius: 6px; background: var(--vp-c-bg); color: var(--vp-c-text-1); font-size: 13px; font-weight: 700; text-align: right; font-family: 'JetBrains Mono', monospace; }
.pct-sym { font-size: 12px; color: var(--vp-c-text-2); }
.row-dag-arrow { flex-shrink: 0; }
.dag-label { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; background: rgba(59,130,246,.12); color: #60a5fa; border: 1px solid rgba(59,130,246,.25); }
.row-computed { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; flex-shrink: 0; }
.comp-amt { font-size: 13px; font-weight: 800; font-family: 'JetBrains Mono', monospace; color: var(--vp-c-text-1); min-width: 110px; }
.comp-rate { font-size: 10px; color: var(--vp-c-text-2); }
.comp-ret { font-size: 11px; font-weight: 700; font-family: 'JetBrains Mono', monospace; min-width: 130px; }
.stock-rate { color: #d97706; }
.bond-rate { color: #3b82f6; }
.cash-rate { color: #10b981; }
.stock-ret { color: #f59e0b; }
.bond-ret { color: #60a5fa; }
.cash-ret { color: #34d399; }
.pd-summary { padding: 14px 20px; border-bottom: 1px solid var(--vp-c-border); background: var(--vp-c-bg); }
.sum-grid { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.sum-item { display: flex; flex-direction: column; gap: 3px; }
.si-label { font-size: 10px; color: var(--vp-c-text-2); font-weight: 600; }
.si-value { font-size: 16px; font-weight: 800; font-family: 'JetBrains Mono', monospace; color: var(--vp-c-text-1); }
.si-value.highlight { color: #10b981; }
.si-value.rate { color: #3b82f6; }
.sum-divider { font-size: 20px; color: var(--vp-c-text-3, var(--vp-c-border)); font-weight: 300; }
.pd-legend { padding: 12px 20px; display: flex; flex-direction: column; gap: 8px; background: var(--vp-c-bg-soft); }
.leg-section { margin-bottom: 10px; }
.leg-section-title { font-size: 11px; font-weight: 700; color: #a78bfa; margin-bottom: 8px; }
.leg-rules { display: flex; flex-direction: column; gap: 5px; }
.rule-item { display: flex; align-items: baseline; gap: 8px; font-size: 12px; }
.rule-trigger { font-size: 11px; font-weight: 700; font-family: 'JetBrains Mono', monospace; padding: 1px 7px; border-radius: 4px; flex-shrink: 0; }
.stock-c { background: rgba(245,158,11,.15); color: #d97706; border: 1px solid rgba(245,158,11,.3); }
.bond-c { background: rgba(59,130,246,.12); color: #60a5fa; border: 1px solid rgba(59,130,246,.25); }
.cash-c { background: rgba(16,185,129,.12); color: #34d399; border: 1px solid rgba(16,185,129,.25); }
.rule-arrow { color: var(--vp-c-text-3, #888); flex-shrink: 0; }
.rule-desc { color: var(--vp-c-text-2); line-height: 1.5; }
.leg-item { display: flex; align-items: flex-start; gap: 8px; font-size: 12px; color: var(--vp-c-text-2); line-height: 1.5; }
.leg-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 3px; }
.leg-dot.dag { background: #60a5fa; }
</style>