<template>
  <div class="df-wrap">
    <div class="df-header">
      <span class="df-badge">MeshForm</span>
      <span class="df-title">{{ copy.headerTitle }}</span>
      <span class="df-desc">{{ copy.headerDesc }}</span>
    </div>

    <v-app theme="dark" class="df-vapp">
      <div class="df-body">
        <div class="df-form-col">
          <MeshForm
            ref="formRef"
            :schema="schema"
            :rules="rules"
            :uischema="uischema"
            @change="onFormChange"
            @submit="onSubmit"
          >
            <template #actions="{ submit }">
              <div class="df-actions">
                <v-btn color="primary" variant="tonal" @click="submit">{{ copy.submit }}</v-btn>
                <v-btn variant="text" color="grey" @click="onReset">{{ copy.reset }}</v-btn>
              </div>
            </template>
          </MeshForm>
        </div>

        <div class="df-panel-col">
          <div class="df-panel">
            <div class="df-panel-hd">
              <span class="df-dot df-dot--green" />{{ copy.liveData }}
            </div>
            <pre class="df-panel-pre">{{ liveStr }}</pre>
          </div>

          <div v-if="submitted" class="df-panel df-panel--success">
            <div class="df-panel-hd">
              <span class="df-dot df-dot--gold" />{{ copy.submittedData }}
            </div>
            <pre class="df-panel-pre">{{ submittedStr }}</pre>
          </div>
        </div>
      </div>
    </v-app>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { MeshForm, from } from '@meshflow/form-vue'
import type { FromDescriptor, MeshFormInstance, MeshFormSchema } from '@meshflow/form-vue'

const props = withDefaults(defineProps<{ en?: boolean }>(), {
  en: false,
})

const copyMap = {
  zh: {
    headerTitle: '云资源采购单 · 11 条联动规则',
    headerDesc: '产品选项刷新、折扣显隐、分期计算，全都由规则统一调度。',
    submit: '提交订单',
    reset: '清空结果',
    liveData: '实时表单数据',
    submittedData: '提交数据',
    formTitle: '云资源采购单',
    productGroup: '产品信息',
    discountGroup: '折扣设置',
    billingGroup: '结算信息',
    category: '产品类目',
    productName: '产品名称',
    quantity: '数量',
    basePrice: '单价 (CNY)',
    discountType: '折扣类型',
    discountAmount: '折扣值',
    subtotal: '小计 (CNY)',
    total: '应付总额 (CNY)',
    paymentMethod: '支付方式',
    installments: '分期期数',
    monthlyPayment: '每期金额 (CNY)',
    notes: '采购备注',
    notesPlaceholder: '可填写特殊要求、交付地点或审批说明',
    percentPlaceholder: '输入百分比，例如 10 表示九折',
    fixedPlaceholder: '输入减免金额，例如 500',
    categories: {
      software: '软件授权',
      hardware: '硬件设备',
      cloud: '云服务',
    },
    discountOptions: {
      none: '无折扣',
      percent: '百分比折扣 (%)',
      fixed: '固定金额减免 (CNY)',
    },
    paymentOptions: {
      invoice: '企业发票',
      credit: '信用额度',
      monthly: '月度分期',
    },
    installmentOptions: {
      three: '3 期',
      six: '6 期',
      twelve: '12 期',
    },
    products: {
      software: [
        { label: '基础版 · CNY 999 / 年', value: 'basic', price: 999 },
        { label: '专业版 · CNY 4,999 / 年', value: 'pro', price: 4999 },
        { label: '企业版 · CNY 19,999 / 年', value: 'enterprise', price: 19999 },
      ],
      hardware: [
        { label: '入门服务器 · CNY 29,999', value: 'server_s', price: 29999 },
        { label: '性能服务器 · CNY 89,999', value: 'server_pro', price: 89999 },
      ],
      cloud: [
        { label: '2C4G · CNY 299 / 月', value: 'cloud_s', price: 299 },
        { label: '4C8G · CNY 599 / 月', value: 'cloud_m', price: 599 },
        { label: '8C16G · CNY 1,099 / 月', value: 'cloud_l', price: 1099 },
      ],
    },
  },
  en: {
    headerTitle: 'Cloud Procurement Form · 11 rules',
    headerDesc: 'Options, visibility, and derived billing all run through one deterministic rule layer.',
    submit: 'Submit order',
    reset: 'Clear result',
    liveData: 'Live form state',
    submittedData: 'Submitted payload',
    formTitle: 'Cloud Procurement Form',
    productGroup: 'Product',
    discountGroup: 'Discount',
    billingGroup: 'Billing',
    category: 'Category',
    productName: 'Product',
    quantity: 'Quantity',
    basePrice: 'Unit price (CNY)',
    discountType: 'Discount type',
    discountAmount: 'Discount value',
    subtotal: 'Subtotal (CNY)',
    total: 'Total due (CNY)',
    paymentMethod: 'Payment method',
    installments: 'Installments',
    monthlyPayment: 'Monthly payment (CNY)',
    notes: 'Notes',
    notesPlaceholder: 'Special requirements, delivery notes, or approval context',
    percentPlaceholder: 'Enter a percentage, for example 10 means 10% off',
    fixedPlaceholder: 'Enter a fixed deduction, for example 500',
    categories: {
      software: 'Software licenses',
      hardware: 'Hardware appliances',
      cloud: 'Cloud services',
    },
    discountOptions: {
      none: 'No discount',
      percent: 'Percentage discount (%)',
      fixed: 'Fixed deduction (CNY)',
    },
    paymentOptions: {
      invoice: 'Invoice',
      credit: 'Credit line',
      monthly: 'Monthly installments',
    },
    installmentOptions: {
      three: '3 months',
      six: '6 months',
      twelve: '12 months',
    },
    products: {
      software: [
        { label: 'Basic · CNY 999 / year', value: 'basic', price: 999 },
        { label: 'Pro · CNY 4,999 / year', value: 'pro', price: 4999 },
        { label: 'Enterprise · CNY 19,999 / year', value: 'enterprise', price: 19999 },
      ],
      hardware: [
        { label: 'Starter server · CNY 29,999', value: 'server_s', price: 29999 },
        { label: 'Performance server · CNY 89,999', value: 'server_pro', price: 89999 },
      ],
      cloud: [
        { label: '2C4G · CNY 299 / month', value: 'cloud_s', price: 299 },
        { label: '4C8G · CNY 599 / month', value: 'cloud_m', price: 599 },
        { label: '8C16G · CNY 1,099 / month', value: 'cloud_l', price: 1099 },
      ],
    },
  },
} as const

const copy = computed(() => props.en ? copyMap.en : copyMap.zh)
const productOptions = computed(() => copy.value.products)
const priceMap = computed(() =>
  Object.fromEntries(
    Object.values(productOptions.value).flat().map((option) => [option.value, option.price]),
  ),
)

const schema = computed<MeshFormSchema>(() => ({
  type: 'object',
  title: copy.value.formTitle,
  properties: {
    product: {
      type: 'object',
      title: copy.value.productGroup,
      'x-layout': 'horizontal',
      properties: {
        category: {
          type: 'string',
          title: copy.value.category,
          default: 'software',
          'x-widget': 'select',
          'x-options': [
            { label: copy.value.categories.software, value: 'software' },
            { label: copy.value.categories.hardware, value: 'hardware' },
            { label: copy.value.categories.cloud, value: 'cloud' },
          ],
        },
        name: {
          type: 'string',
          title: copy.value.productName,
          default: 'basic',
          'x-widget': 'select',
          'x-options': [],
        },
        quantity: { type: 'integer', title: copy.value.quantity, default: 1, 'x-min': 1 },
        basePrice: { type: 'number', title: copy.value.basePrice, default: 999, 'x-readonly': true, 'x-disabled': true },
      },
    },
    discount: {
      type: 'object',
      title: copy.value.discountGroup,
      'x-layout': 'horizontal',
      properties: {
        type: {
          type: 'string',
          title: copy.value.discountType,
          default: 'none',
          'x-widget': 'select',
          'x-options': [
            { label: copy.value.discountOptions.none, value: 'none' },
            { label: copy.value.discountOptions.percent, value: 'percent' },
            { label: copy.value.discountOptions.fixed, value: 'fixed' },
          ],
        },
        amount: {
          type: 'number',
          title: copy.value.discountAmount,
          default: 0,
          'x-hidden': true,
          'x-placeholder': copy.value.percentPlaceholder,
        },
      },
    },
    billing: {
      type: 'object',
      title: copy.value.billingGroup,
      'x-layout': 'horizontal',
      properties: {
        subtotal: { type: 'number', title: copy.value.subtotal, default: 999, 'x-readonly': true, 'x-disabled': true },
        total: { type: 'number', title: copy.value.total, default: 999, 'x-readonly': true, 'x-disabled': true, 'x-theme': 'success' },
        paymentMethod: {
          type: 'string',
          title: copy.value.paymentMethod,
          default: 'invoice',
          'x-widget': 'select',
          'x-options': [
            { label: copy.value.paymentOptions.invoice, value: 'invoice' },
            { label: copy.value.paymentOptions.credit, value: 'credit' },
            { label: copy.value.paymentOptions.monthly, value: 'monthly' },
          ],
        },
        installments: {
          type: 'string',
          title: copy.value.installments,
          default: '3',
          'x-hidden': true,
          'x-widget': 'select',
          'x-options': [
            { label: copy.value.installmentOptions.three, value: '3' },
            { label: copy.value.installmentOptions.six, value: '6' },
            { label: copy.value.installmentOptions.twelve, value: '12' },
          ],
        },
        monthlyPayment: {
          type: 'number',
          title: copy.value.monthlyPayment,
          default: 0,
          'x-hidden': true,
          'x-readonly': true,
          'x-disabled': true,
          'x-theme': 'info',
        },
        notes: {
          type: 'string',
          title: copy.value.notes,
          default: '',
          'x-placeholder': copy.value.notesPlaceholder,
        },
      },
    },
  },
}))

const rules = computed<Record<string, FromDescriptor>>(() => ({
  'product.name.options': from('product.category', (category: string) =>
    (productOptions.value[category as keyof typeof productOptions.value] ?? []).map(({ label, value }) => ({ label, value })),
  {
    effect: ({ options, value }: { options: Array<{ value: string }>; value: string }) => {
      const valid = options.some((option) => option.value === value)
      return valid ? undefined : { value: options[0]?.value ?? '' }
    },
    effectArgs: ['options', 'value'],
  }),
  'product.basePrice.value': from('product.name', (name: string) => priceMap.value[name] ?? 0),
  'billing.subtotal.value': from(['product.basePrice', 'product.quantity'], (price: number, quantity: number) => price * quantity),
  'discount.amount.hidden': from('discount.type', (type: string) => type === 'none'),
  'discount.amount.placeholder': from('discount.type', (type: string) =>
    type === 'percent' ? copy.value.percentPlaceholder : copy.value.fixedPlaceholder,
  ),
  'billing.total.value': from(['billing.subtotal', 'discount.type', 'discount.amount'], (subtotal: number, type: string, amount: number) => {
    if (type === 'percent') return Math.round(subtotal * (1 - amount / 100))
    if (type === 'fixed') return Math.max(0, subtotal - amount)
    return subtotal
  }),
  'billing.installments.hidden': from('billing.paymentMethod', (method: string) => method !== 'monthly'),
  'billing.monthlyPayment.hidden': from('billing.paymentMethod', (method: string) => method !== 'monthly'),
  'billing.monthlyPayment.value': from(['billing.total', 'billing.installments', 'billing.paymentMethod'], (total: number, installments: string, method: string) => {
    if (method !== 'monthly') return 0
    const count = parseInt(installments, 10)
    return count > 0 ? Math.round(total / count) : 0
  }),
}))

function control(scope: string, span = 1) {
  return { type: 'Control', scope, ...(span !== 1 ? { options: { span } } : {}) } as const
}
function row(...elements: unknown[]) {
  return { type: 'HorizontalLayout', elements } as const
}
function group(label: string, ...elements: unknown[]) {
  return { type: 'Group', label, elements } as const
}

const uischema = computed(() => ({
  type: 'VerticalLayout',
  elements: [
    group(
      copy.value.productGroup,
      row(
        control('#/properties/product/properties/category'),
        control('#/properties/product/properties/name', 2),
        control('#/properties/product/properties/quantity'),
        control('#/properties/product/properties/basePrice'),
      ),
    ),
    group(
      copy.value.discountGroup,
      row(
        control('#/properties/discount/properties/type', 2),
        control('#/properties/discount/properties/amount', 2),
      ),
    ),
    group(
      copy.value.billingGroup,
      row(
        control('#/properties/billing/properties/subtotal'),
        control('#/properties/billing/properties/total'),
        control('#/properties/billing/properties/paymentMethod', 2),
      ),
      row(
        control('#/properties/billing/properties/installments'),
        control('#/properties/billing/properties/monthlyPayment'),
        control('#/properties/billing/properties/notes', 3),
      ),
    ),
  ],
}))

const formRef = ref<MeshFormInstance>()
const liveData = ref<Record<string, unknown>>({})
const submitted = ref(false)
const submittedData = ref<Record<string, unknown>>({})

const liveStr = computed(() => JSON.stringify(liveData.value, null, 2))
const submittedStr = computed(() => JSON.stringify(submittedData.value, null, 2))

function onFormChange(data: Record<string, unknown>) {
  liveData.value = data
}
function onSubmit(data: Record<string, unknown>) {
  submittedData.value = data
  submitted.value = true
}
function onReset() {
  void formRef.value
  submitted.value = false
  submittedData.value = {}
}
</script>

<style scoped>
.df-wrap {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 14px;
  overflow: hidden;
  margin: 24px 0;
  font-size: 13px;
}

.df-header {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 13px 20px;
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
}
.df-badge {
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  font-family: 'JetBrains Mono', monospace;
}
.df-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.df-desc {
  font-size: 11px;
  color: var(--vp-c-text-2);
  margin-left: auto;
}

.df-vapp {
  background: transparent !important;
  min-height: 0 !important;
  display: block !important;
}

.df-body {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 0;
  align-items: start;
}
@media (max-width: 800px) {
  .df-body {
    grid-template-columns: 1fr;
  }
}

.df-form-col {
  padding: 16px 20px;
  border-right: 1px solid var(--vp-c-border);
}
@media (max-width: 800px) {
  .df-form-col {
    border-right: none;
    border-bottom: 1px solid var(--vp-c-border);
  }
}

.df-actions {
  display: flex;
  gap: 10px;
  padding-top: 8px;
}

.df-panel-col {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: sticky;
  top: 80px;
}

.df-panel {
  border-bottom: 1px solid var(--vp-c-border);
  overflow: hidden;
}
.df-panel:last-child {
  border-bottom: none;
}
.df-panel--success .df-panel-hd {
  color: #4caf50;
}

.df-panel-hd {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
}
.df-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.df-dot--green {
  background: #4caf50;
  box-shadow: 0 0 5px #4caf50;
}
.df-dot--gold {
  background: #ffd54f;
  box-shadow: 0 0 5px #ffd54f;
}

.df-form-col :deep(.mesh-layout--horizontal) {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 8px 16px !important;
  width: 100% !important;
}
.df-form-col :deep(.mesh-layout__item),
.df-form-col :deep(.mesh-layout--horizontal > *) {
  flex: 1 1 180px !important;
  min-width: 0 !important;
}

.df-panel-pre {
  margin: 0;
  padding: 10px 14px;
  font-size: 11px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 340px;
  overflow-y: auto;
  font-family: 'JetBrains Mono', monospace;
  background: var(--vp-c-bg-soft);
}
</style>