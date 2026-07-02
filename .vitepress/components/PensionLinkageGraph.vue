<template>
  <div class="pen-graph-wrap">
    <div class="graph-header">
      <span class="graph-badge">DAG</span>
      <span class="graph-title">{{ copy.title }}</span>
      <span class="graph-hint">{{ copy.hint }}</span>
    </div>
    <div class="graph-body">
      <VueFlow
        :nodes="nodes"
        :edges="edges"
        :fit-view-on-init="true"
        class="pen-flow"
      >
        <template #node-field="{ data }">
          <div class="field-node" :class="data.group">
            <div class="fn-dot"></div>
            <div class="fn-label">{{ data.label }}</div>
            <div v-if="data.sub" class="fn-sub">{{ data.sub }}</div>
          </div>
        </template>
      </VueFlow>
    </div>
    <div class="graph-legend">
      <span class="leg-item"><span class="leg-dot personal"></span>{{ copy.legend[0] }}</span>
      <span class="leg-item"><span class="leg-dot strategy"></span>{{ copy.legend[1] }}</span>
      <span class="leg-item"><span class="leg-dot contribution"></span>{{ copy.legend[2] }}</span>
      <span class="leg-item"><span class="leg-dot forward"></span>{{ copy.legend[3] }}</span>
      <span class="leg-item"><span class="leg-dot reverse"></span>{{ copy.legend[4] }}</span>
      <span class="leg-item"><span class="leg-edge blue"></span>{{ copy.legend[5] }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VueFlow } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

const props = withDefaults(defineProps<{ en?: boolean }>(), {
  en: false,
})
const copyMap = {
  zh: {
    title: '养老年金联动依赖图（双向计算链）',
    hint: '正向推算退休金，反向推算缺口，共享同一套参数',
    legend: ['个人信息', '投资策略', '缴费方案', '正向推算', '反向推算', '值传播'],
  },
  en: {
    title: 'Pension dependency graph (two-way calculation chain)',
    hint: 'Forward retirement projection and reverse gap planning share the same parameter set.',
    legend: ['Personal', 'Strategy', 'Contribution', 'Forward', 'Reverse', 'Value propagation'],
  },
} as const
const copy = computed(() => (props.en ? copyMap.en : copyMap.zh))

const enText = {
  "当前年龄": "Current age",
  "退休年龄": "Retirement age",
  "当前月薪": "Current monthly salary",
  "薪资增长率": "Income growth rate",
  "领取年限": "Withdrawal years",
  "投资风格": "Risk profile",
  "通胀率": "Inflation",
  "个人月缴": "Personal monthly",
  "单位匹配比例": "Employer match",
  "目标替代率": "Target replacement rate",
  "用户设定": "user input",
  "积累年数": "Accumulation years",
  "退休年龄 - 当前年龄": "retirement age - current age",
  "年化收益率": "Annual return",
  "← 投资风格": "<- risk profile",
  "月缴合计": "Total monthly",
  "个人 × (1 + 匹配比)": "personal × (1 + match)",
  "退休月薪": "Salary at retirement",
  "月薪 × (1+g)^n": "salary × (1+g)^n",
  "年缴合计": "Annual total",
  "月缴合计 × 12": "total monthly × 12",
  "税优上限": "Tax-advantaged cap",
  "月薪 × 12 × 6%": "salary × 12 × 6%",
  "积累终值": "Accumulated FV",
  "FV(r, n×12, PMT)": "FV(r, n×12, PMT)",
  "月退休金": "Monthly pension",
  "PMT(r×0.5, n×12, FV)": "PMT(r×0.5, n×12, FV)",
  "实际购买力": "Real purchasing power",
  "FV ÷ (1+通胀)^n": "FV ÷ (1+inflation)^n",
  "目标月退休金": "Target monthly pension",
  "退休月薪 × 目标替代率": "retirement salary × target rate",
  "替代率": "Replacement rate",
  "月退休金 ÷ 退休月薪": "monthly pension ÷ retirement salary",
  "所需积累": "Required accumulation",
  "PV(r×0.5, n×12, 目标)": "PV(r×0.5, n×12, target)",
  "替代率评级": "Replacement status",
  "🟢优秀 / 🟡良好 / 🔴不足": "🟢/🟡/🔴 status",
  "所需月缴": "Required monthly total",
  "PMT(r, n×12, 所需积累)": "PMT(r, n×12, required accumulation)",
  "个人缺口": "Personal gap",
  "所需月缴 ÷ (1+匹配) - 个人月缴": "required total ÷ (1+match) - personal monthly"
} as const

function localizeDeep(value, dict) {
  if (Array.isArray(value)) return value.map(item => localizeDeep(item, dict))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localizeDeep(item, dict)]))
  }
  if (typeof value === 'string') return dict[value] ?? value
  return value
}

// ── 节点定义 ─────────────────────────────────────────────────────────────────
// Top half  (y=0-440):  正向推算链 → 积累 FV → 月退休金 → 替代率
// Bottom half (y=520-700): 反向推算链 → 目标月退休金 → 所需积累 → 月缺口

const rawNodes = [
  // ── Layer 0: User inputs ─────────────────────────────────────────────────
  { id: 'currentAge',       type: 'field', position: { x: 0,    y: 0   }, data: { label: '当前年龄',     group: 'personal',     sub: 'currentAge' } },
  { id: 'retirementAge',    type: 'field', position: { x: 0,    y: 65  }, data: { label: '退休年龄',     group: 'personal',     sub: 'retirementAge' } },
  { id: 'currentWage',      type: 'field', position: { x: 0,    y: 155 }, data: { label: '当前月薪',     group: 'personal',     sub: 'currentWage' } },
  { id: 'wageGrowthRate',   type: 'field', position: { x: 0,    y: 220 }, data: { label: '薪资增长率',   group: 'personal',     sub: 'wageGrowthRate' } },
  { id: 'withdrawYears',    type: 'field', position: { x: 0,    y: 295 }, data: { label: '领取年限',     group: 'personal',     sub: 'withdrawYears' } },
  { id: 'style',            type: 'field', position: { x: 0,    y: 390 }, data: { label: '投资风格',     group: 'strategy',     sub: 'strategy.style' } },
  { id: 'inflationRate',    type: 'field', position: { x: 0,    y: 460 }, data: { label: '通胀率',       group: 'strategy',     sub: 'inflationRate' } },
  { id: 'personalMonthly',  type: 'field', position: { x: 0,    y: 560 }, data: { label: '个人月缴',     group: 'contribution', sub: 'personalMonthly' } },
  { id: 'companyMatchRate', type: 'field', position: { x: 0,    y: 630 }, data: { label: '单位匹配比例', group: 'contribution', sub: 'companyMatchRate' } },
  { id: 'targetRate',       type: 'field', position: { x: 0,    y: 760 }, data: { label: '目标替代率',   group: 'reverse',      sub: '用户设定' } },

  // ── Layer 1: First derived ────────────────────────────────────────────────
  { id: 'accumYears',       type: 'field', position: { x: 220,  y: 20  }, data: { label: '积累年数',     group: 'personal',     sub: '退休年龄 - 当前年龄' } },
  { id: 'annualReturn',     type: 'field', position: { x: 220,  y: 390 }, data: { label: '年化收益率',   group: 'strategy',     sub: '← 投资风格' } },
  { id: 'totalMonthly',     type: 'field', position: { x: 220,  y: 580 }, data: { label: '月缴合计',     group: 'contribution', sub: '个人 × (1 + 匹配比)' } },

  // ── Layer 2: Intermediate ─────────────────────────────────────────────────
  { id: 'retirementWage',   type: 'field', position: { x: 440,  y: 155 }, data: { label: '退休月薪',     group: 'forward',      sub: '月薪 × (1+g)^n' } },
  { id: 'annualTotal',      type: 'field', position: { x: 440,  y: 580 }, data: { label: '年缴合计',     group: 'contribution', sub: '月缴合计 × 12' } },
  { id: 'taxBenefitLimit',  type: 'field', position: { x: 440,  y: 660 }, data: { label: '税优上限',     group: 'contribution', sub: '月薪 × 12 × 6%' } },
  { id: 'accumulatedFv',    type: 'field', position: { x: 440,  y: 320 }, data: { label: '积累终值',     group: 'forward',      sub: 'FV(r, n×12, PMT)' } },

  // ── Layer 3: Forward results ──────────────────────────────────────────────
  { id: 'monthlyPension',       type: 'field', position: { x: 680,  y: 200 }, data: { label: '月退休金',     group: 'forward', sub: 'PMT(r×0.5, n×12, FV)' } },
  { id: 'realPurchasingPower',  type: 'field', position: { x: 680,  y: 320 }, data: { label: '实际购买力',   group: 'forward', sub: 'FV ÷ (1+通胀)^n' } },
  { id: 'targetMonthlyPension', type: 'field', position: { x: 680,  y: 730 }, data: { label: '目标月退休金', group: 'reverse', sub: '退休月薪 × 目标替代率' } },

  // ── Layer 4: Further derived ──────────────────────────────────────────────
  { id: 'replacementRate',      type: 'field', position: { x: 920,  y: 160 }, data: { label: '替代率',       group: 'forward', sub: '月退休金 ÷ 退休月薪' } },
  { id: 'requiredAccumulation', type: 'field', position: { x: 920,  y: 730 }, data: { label: '所需积累',     group: 'reverse', sub: 'PV(r×0.5, n×12, 目标)' } },

  // ── Layer 5: Final metrics ────────────────────────────────────────────────
  { id: 'replacementStatus',    type: 'field', position: { x: 1160, y: 130 }, data: { label: '替代率评级',   group: 'forward', sub: '🟢优秀 / 🟡良好 / 🔴不足' } },
  { id: 'requiredMonthly',      type: 'field', position: { x: 1160, y: 700 }, data: { label: '所需月缴',     group: 'reverse', sub: 'PMT(r, n×12, 所需积累)' } },

  // ── Layer 6: Gap ─────────────────────────────────────────────────────────
  { id: 'personalGap',          type: 'field', position: { x: 1400, y: 700 }, data: { label: '个人缺口',     group: 'reverse', sub: '所需月缴 ÷ (1+匹配) - 个人月缴' } },
]

const nodes = computed(() => (props.en ? localizeDeep(rawNodes, enText) : rawNodes))

// ── 边定义 ───────────────────────────────────────────────────────────────────
const blue  = { animated: true,  style: { stroke: '#6366f1', strokeWidth: 1.5 } }
const green = { animated: true,  style: { stroke: '#10b981', strokeWidth: 1.5 } }
const amber = { animated: true,  style: { stroke: '#f59e0b', strokeWidth: 1.5 } }

const edges = [
  // ── Personal → accumYears
  { id: 'e-ca-ay',   source: 'currentAge',       target: 'accumYears',           ...blue },
  { id: 'e-ra-ay',   source: 'retirementAge',    target: 'accumYears',           ...blue },

  // ── Strategy → annualReturn
  { id: 'e-st-ar',   source: 'style',            target: 'annualReturn',         ...blue },

  // ── Personal → retirementWage
  { id: 'e-cw-rw',   source: 'currentWage',      target: 'retirementWage',       ...blue },
  { id: 'e-wg-rw',   source: 'wageGrowthRate',   target: 'retirementWage',       ...blue },
  { id: 'e-ay-rw',   source: 'accumYears',        target: 'retirementWage',       ...blue },

  // ── Contribution → totalMonthly
  { id: 'e-pm-tm',   source: 'personalMonthly',  target: 'totalMonthly',         ...blue },
  { id: 'e-cm-tm',   source: 'companyMatchRate',  target: 'totalMonthly',         ...blue },

  // ── totalMonthly → annualTotal
  { id: 'e-tm-at',   source: 'totalMonthly',     target: 'annualTotal',          ...blue },

  // ── currentWage → taxBenefitLimit
  { id: 'e-cw-tbl',  source: 'currentWage',      target: 'taxBenefitLimit',      ...blue },

  // ── accumulatedFv inputs
  { id: 'e-tm-fv',   source: 'totalMonthly',     target: 'accumulatedFv',        ...blue },
  { id: 'e-ar-fv',   source: 'annualReturn',      target: 'accumulatedFv',        ...blue },
  { id: 'e-ay-fv',   source: 'accumYears',        target: 'accumulatedFv',        ...blue },

  // ── Forward chain: accumulatedFv → monthlyPension
  { id: 'e-fv-mp',   source: 'accumulatedFv',    target: 'monthlyPension',       ...green },
  { id: 'e-ar-mp',   source: 'annualReturn',      target: 'monthlyPension',       ...green },
  { id: 'e-wy-mp',   source: 'withdrawYears',     target: 'monthlyPension',       ...green },

  // ── accumulatedFv → realPurchasingPower
  { id: 'e-fv-rpp',  source: 'accumulatedFv',    target: 'realPurchasingPower',  ...green },
  { id: 'e-inf-rpp', source: 'inflationRate',    target: 'realPurchasingPower',  ...green },
  { id: 'e-ay-rpp',  source: 'accumYears',        target: 'realPurchasingPower',  ...green },

  // ── replacementRate
  { id: 'e-mp-rr',   source: 'monthlyPension',   target: 'replacementRate',      ...green },
  { id: 'e-rw-rr',   source: 'retirementWage',   target: 'replacementRate',      ...green },
  { id: 'e-rr-rs',   source: 'replacementRate',  target: 'replacementStatus',    ...green },

  // ── Reverse chain
  { id: 'e-rw-tmp',  source: 'retirementWage',   target: 'targetMonthlyPension', ...amber },
  { id: 'e-tr-tmp',  source: 'targetRate',        target: 'targetMonthlyPension', ...amber },

  { id: 'e-tmp-ra',  source: 'targetMonthlyPension', target: 'requiredAccumulation', ...amber },
  { id: 'e-ar-ra',   source: 'annualReturn',          target: 'requiredAccumulation', ...amber },
  { id: 'e-wy-ra',   source: 'withdrawYears',          target: 'requiredAccumulation', ...amber },

  { id: 'e-ra-rm',   source: 'requiredAccumulation', target: 'requiredMonthly',   ...amber },
  { id: 'e-ar-rm',   source: 'annualReturn',          target: 'requiredMonthly',   ...amber },
  { id: 'e-ay-rm',   source: 'accumYears',             target: 'requiredMonthly',   ...amber },

  { id: 'e-rm-pg',   source: 'requiredMonthly',  target: 'personalGap',          ...amber },
  { id: 'e-cm-pg',   source: 'companyMatchRate', target: 'personalGap',          ...amber },
  { id: 'e-pm-pg',   source: 'personalMonthly',  target: 'personalGap',          ...amber },
]
</script>

<style scoped>
.pen-graph-wrap {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  overflow: hidden;
  margin: 24px 0;
}

.graph-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--vp-c-border);
  flex-wrap: wrap;
}
.graph-badge {
  font-size: 10px;
  font-weight: 800;
  font-family: 'JetBrains Mono', monospace;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(16,185,129,.15);
  color: #34d399;
  border: 1px solid rgba(16,185,129,.3);
  letter-spacing: 0.06em;
}
.graph-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.graph-hint {
  font-size: 11px;
  color: var(--vp-c-text-2);
  margin-left: auto;
}

.graph-body {
  height: 600px;
}

.pen-flow {
  width: 100%;
  height: 100%;
  background: transparent !important;
}

:deep(.vue-flow__background) { background: transparent !important; }
:deep(.vue-flow__edge-path) { stroke-opacity: 0.75; }
:deep(.vue-flow__node) { padding: 0 !important; background: transparent !important; border: none !important; box-shadow: none !important; }
:deep(.vue-flow__handle) { opacity: 0; }

/* Field nodes */
.field-node {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 5px 10px 5px 22px;
  border-radius: 7px;
  border: 1px solid;
  min-width: 150px;
  max-width: 190px;
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  cursor: default;
  position: relative;
}
.fn-dot {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.fn-label {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: inherit;
}
.fn-sub {
  font-size: 9px;
  opacity: 0.65;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 1px;
}

/* ── Group colors ─────────────────────────────────────────────────────────── */
.field-node.personal {
  background: rgba(99,102,241,.1);
  border-color: rgba(99,102,241,.4);
  color: #818cf8;
}
.field-node.personal .fn-dot { background: #6366f1; }

.field-node.strategy {
  background: rgba(139,92,246,.1);
  border-color: rgba(139,92,246,.4);
  color: #a78bfa;
}
.field-node.strategy .fn-dot { background: #8b5cf6; }

.field-node.contribution {
  background: rgba(14,165,233,.1);
  border-color: rgba(14,165,233,.4);
  color: #38bdf8;
}
.field-node.contribution .fn-dot { background: #0ea5e9; }

.field-node.forward {
  background: rgba(16,185,129,.1);
  border-color: rgba(16,185,129,.4);
  color: #34d399;
}
.field-node.forward .fn-dot { background: #10b981; }

.field-node.reverse {
  background: rgba(245,158,11,.1);
  border-color: rgba(245,158,11,.4);
  color: #fbbf24;
}
.field-node.reverse .fn-dot { background: #f59e0b; }

/* Legend */
.graph-legend {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 10px 18px;
  border-top: 1px solid var(--vp-c-border);
  font-size: 11px;
  color: var(--vp-c-text-2);
}
.leg-item { display: flex; align-items: center; gap: 5px; }
.leg-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.leg-dot.personal     { background: #6366f1; }
.leg-dot.strategy     { background: #8b5cf6; }
.leg-dot.contribution { background: #0ea5e9; }
.leg-dot.forward      { background: #10b981; }
.leg-dot.reverse      { background: #f59e0b; }
.leg-edge {
  width: 24px; height: 2px; flex-shrink: 0;
}
.leg-edge.blue { background: #6366f1; }
</style>
