<template>
  <v-app theme="dark" class="qd-app">
    <MeshForm :schema="schema" :rules="rules" @change="onFormChange">
      <template #actions></template>
    </MeshForm>

    <div class="result-card" v-if="liveData['annualPremium'] != null">
      <div class="result-label">{{ texts.resultLabel }}</div>
      <div class="result-value">{{ currencySymbol }} {{ Number(liveData['annualPremium'] ?? 0).toLocaleString() }}</div>
      <div class="result-sub">{{ texts.resultSub }} {{ currencySymbol }} {{ Number(liveData['monthlyPremium'] ?? 0).toLocaleString() }}</div>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { MeshForm, from } from '@meshflow/form-vue'
import type { MeshFormSchema, FromDescriptor } from '@meshflow/form-vue'

const props = withDefaults(defineProps<{ lang?: 'zh' | 'en' }>(), {
  lang: 'zh',
})

const copy = {
  zh: {
    title: '保费速算',
    productType: '险种',
    gender: '性别',
    age: '年龄',
    coverageAmount: '保额（万）',
    annualPremium: '年保费（元）',
    monthlyPremium: '月均保费（元）',
    term: '定期寿险',
    whole: '终身寿险',
    endow: '两全险',
    male: '男',
    female: '女（费率低 15%）',
    resultLabel: '预估年保费',
    resultSub: '月均',
    currencySymbol: '¥',
  },
  en: {
    title: 'Premium Estimator',
    productType: 'Product Type',
    gender: 'Gender',
    age: 'Age',
    coverageAmount: 'Coverage (10k)',
    annualPremium: 'Annual Premium',
    monthlyPremium: 'Monthly Premium',
    term: 'Term Life',
    whole: 'Whole Life',
    endow: 'Endowment',
    male: 'Male',
    female: 'Female (15% lower rate)',
    resultLabel: 'Estimated Annual Premium',
    resultSub: 'Monthly average',
    currencySymbol: '$',
  },
} as const

const texts = computed(() => copy[props.lang])
const currencySymbol = computed(() => texts.value.currencySymbol)

const RATE_TABLE: Record<string, number[]> = {
  term: [0.4, 0.7, 1.2, 2.0, 3.5],
  whole: [8.0, 10.0, 14.0, 19.0, 27.0],
  endow: [14.0, 18.0, 24.0, 32.0, 42.0],
}

function ageBracket(age: number) {
  if (age < 30) return 0
  if (age < 40) return 1
  if (age < 50) return 2
  if (age < 60) return 3
  return 4
}

const schema = computed<MeshFormSchema>(() => ({
  type: 'object',
  title: texts.value.title,
  properties: {
    productType: {
      type: 'string',
      title: texts.value.productType,
      default: 'term',
      'x-widget': 'select',
      'x-options': [
        { label: texts.value.term, value: 'term' },
        { label: texts.value.whole, value: 'whole' },
        { label: texts.value.endow, value: 'endow' },
      ],
    },
    gender: {
      type: 'string',
      title: texts.value.gender,
      default: 'M',
      'x-widget': 'select',
      'x-options': [
        { label: texts.value.male, value: 'M' },
        { label: texts.value.female, value: 'F' },
      ],
    },
    age: { type: 'integer', title: texts.value.age, default: 30, 'x-min': 18 },
    coverageAmount: {
      type: 'number',
      title: texts.value.coverageAmount,
      default: 100,
      'x-widget': 'select',
      'x-options': [
        { label: '50', value: 50 },
        { label: '100', value: 100 },
        { label: '200', value: 200 },
        { label: '500', value: 500 },
        { label: '1000', value: 1000 },
      ],
    },
    annualPremium: { type: 'number', title: texts.value.annualPremium, default: 0, 'x-readonly': true, 'x-disabled': true, 'x-theme': 'success' },
    monthlyPremium: { type: 'number', title: texts.value.monthlyPremium, default: 0, 'x-readonly': true, 'x-disabled': true, 'x-theme': 'info' },
  },
}))

const rules: Record<string, FromDescriptor> = {
  'annualPremium.value': from(['productType', 'gender', 'age', 'coverageAmount'], (pt: string, g: string, age: number, ca: number) => {
    const raw = RATE_TABLE[pt]?.[ageBracket(age)] ?? 5
    const rate = Math.round(raw * (g === 'F' ? 0.85 : 1.0) * 100) / 100
    return Math.round(ca * rate * 10)
  }),
  'monthlyPremium.value': from('annualPremium', (p: number) => Math.round(p / 12)),
}

const liveData = ref<Record<string, any>>({})
function onFormChange(data: Record<string, any>) {
  liveData.value = data
}
</script>

<style scoped>
.qd-app { background: transparent !important; }
.result-card { margin-top: 16px; padding: 16px 20px; background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.25); border-radius: 10px; text-align: center; }
.result-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.4); margin-bottom: 4px; }
.result-value { font-size: 36px; font-weight: 800; font-family: 'JetBrains Mono', monospace; color: #4caf50; line-height: 1.1; }
.result-sub { font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 4px; }
</style>