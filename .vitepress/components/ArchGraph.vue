<template>
  <div class="arch-wrap">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :fit-view-on-init="true"
      :prevent-scrolling="false"
      :nodes-draggable="false"
      :zoom-on-scroll="false"
      :pan-on-drag="false"
      class="arch-flow"
    >
      <template #node-pkg="{ data }">
        <div class="pkg-node" :class="data.variant">
          <div class="pkg-head">
            <span class="pkg-scope">{{ data.scope }}/</span><span class="pkg-name">{{ data.name }}</span>
            <span v-if="data.tag" class="pkg-tag" :class="data.variant">{{ data.tag }}</span>
          </div>
          <div class="pkg-desc">{{ data.desc }}</div>
          <div v-if="data.note" class="pkg-note">{{ data.note }}</div>
        </div>
      </template>
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VueFlow } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

const props = withDefaults(defineProps<{ lang?: 'zh' | 'en' }>(), {
  lang: 'zh',
})

const copy = {
  zh: {
    formVueDesc: '作为 <json-forms> 的 Drop-in 包装层，注入 UITrigger，并接管精确的局部重绘控制。',
    jsonformsVueTag: '视图层',
    jsonformsVueDesc: '渲染层继续专注于表现，只负责响应引擎驱动的 UI 更新。',
    formTag: '适配层',
    formDesc: '将 Schema 与联动规则编译为引擎可识别的节点与依赖边。',
    coreTag: '协议层',
    coreDesc: '提供 JSON Forms 所使用的 renderer 协议与基础类型。',
    engineDesc: '纯 TypeScript 实现的 DAG 调度、异步安全传播与状态收敛引擎。',
    engineNote: '框架无关：负责依赖图、异步顺序与拓扑驱动执行。',
    edgeRerender: '精确局部重绘',
    edgeEvents: '传递交互事件',
    edgeScheduling: '触发拓扑调度',
    edgeType: '类型依赖',
  },
  en: {
    formVueDesc: 'A drop-in wrapper around <json-forms> that injects UI triggers and takes over precise rerender control.',
    jsonformsVueTag: 'View Layer',
    jsonformsVueDesc: 'The rendering layer stays focused on presentation and reacts to engine-driven UI updates.',
    formTag: 'Adapter',
    formDesc: 'Compiles schema and linkage rules into engine-readable nodes and dependency edges.',
    coreTag: 'Protocol',
    coreDesc: 'Provides the renderer protocol and foundational types used by JSON Forms.',
    engineDesc: 'A pure TypeScript engine for DAG scheduling, async-safe propagation, and state convergence.',
    engineNote: 'Framework-agnostic: handles dependency graphs, async ordering, and topology-driven execution.',
    edgeRerender: 'Precise UI rerenders',
    edgeEvents: 'Pass interaction events',
    edgeScheduling: 'Trigger graph scheduling',
    edgeType: 'Type dependency',
  },
} as const

const t = computed(() => copy[props.lang])

const nodes = computed(() => [
  {
    id: 'form-vue',
    type: 'pkg',
    position: { x: 230, y: 0 },
    data: {
      variant: 'entry',
      scope: '@meshflow',
      name: 'form-vue',
      tag: 'Drop-in Wrapper',
      desc: t.value.formVueDesc,
    },
  },
  {
    id: 'jsonforms-vue',
    type: 'pkg',
    position: { x: 0, y: 200 },
    data: {
      variant: 'jf',
      scope: '@jsonforms',
      name: 'vue',
      tag: t.value.jsonformsVueTag,
      desc: t.value.jsonformsVueDesc,
    },
  },
  {
    id: 'meshflow-form',
    type: 'pkg',
    position: { x: 460, y: 200 },
    data: {
      variant: 'mf',
      scope: '@meshflow',
      name: 'form',
      tag: t.value.formTag,
      desc: t.value.formDesc,
    },
  },
  {
    id: 'jsonforms-core',
    type: 'pkg',
    position: { x: 0, y: 400 },
    data: {
      variant: 'jf-core',
      scope: '@jsonforms',
      name: 'core',
      tag: t.value.coreTag,
      desc: t.value.coreDesc,
    },
  },
  {
    id: 'meshflow-core',
    type: 'pkg',
    position: { x: 460, y: 400 },
    data: {
      variant: 'core',
      scope: '@meshflow',
      name: 'core',
      tag: 'Engine',
      desc: t.value.engineDesc,
      note: t.value.engineNote,
    },
  },
])

const solid = {
  type: 'smoothstep',
  animated: false,
  style: { strokeWidth: 1.5 },
  markerEnd: { type: 'arrowclosed' },
}

const animatedEdge = {
  type: 'smoothstep',
  animated: true,
  style: { strokeWidth: 2, strokeDasharray: '5 5' },
  markerEnd: { type: 'arrowclosed' },
}

const edges = computed(() => [
  {
    id: 'e-fv-jv',
    source: 'form-vue',
    target: 'jsonforms-vue',
    label: t.value.edgeRerender,
    labelStyle: { fill: '#60a5fa', fontSize: 11, fontWeight: 700 },
    labelBgStyle: { fill: 'transparent' },
    ...solid,
    style: { stroke: '#60a5fa', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed', color: '#60a5fa' },
  },
  {
    id: 'e-fv-mf',
    source: 'form-vue',
    target: 'meshflow-form',
    label: t.value.edgeEvents,
    labelStyle: { fill: '#a78bfa', fontSize: 11, fontWeight: 700 },
    labelBgStyle: { fill: 'transparent' },
    ...animatedEdge,
    style: { stroke: '#a78bfa', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed', color: '#a78bfa' },
  },
  {
    id: 'e-jv-jc',
    source: 'jsonforms-vue',
    target: 'jsonforms-core',
    ...solid,
    style: { stroke: '#60a5fa', strokeWidth: 1.5, opacity: 0.6 },
    markerEnd: { type: 'arrowclosed', color: '#60a5fa' },
  },
  {
    id: 'e-mf-mc',
    source: 'meshflow-form',
    target: 'meshflow-core',
    label: t.value.edgeScheduling,
    labelStyle: { fill: '#fbbf24', fontSize: 11, fontWeight: 700 },
    labelBgStyle: { fill: 'transparent' },
    ...animatedEdge,
    style: { stroke: '#fbbf24', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed', color: '#fbbf24' },
  },
  {
    id: 'e-mf-jc',
    source: 'meshflow-form',
    target: 'jsonforms-core',
    label: t.value.edgeType,
    labelStyle: { fill: '#64748b', fontSize: 9, fontWeight: 600 },
    labelBgStyle: { fill: 'transparent' },
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#475569', strokeWidth: 1, strokeDasharray: '4 4' },
    markerEnd: { type: 'arrowclosed', color: '#475569' },
  },
])
</script>

<style scoped>
.arch-wrap {
  height: 580px;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  overflow: hidden;
  margin: 24px 0;
  background: var(--vp-c-bg);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
}

.arch-flow {
  width: 100%;
  height: 100%;
  background: transparent !important;
}

:deep(.vue-flow__background) { background: transparent !important; }
:deep(.vue-flow__node) { padding: 0 !important; background: transparent !important; border: none !important; box-shadow: none !important; }
:deep(.vue-flow__handle) { opacity: 0; }
:deep(.vue-flow__edge-path) { stroke-opacity: 0.8; }
:deep(.vue-flow__edge-text) { font-family: 'JetBrains Mono', sans-serif; }

.pkg-node {
  width: 240px;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1.5px solid transparent;
  display: flex;
  flex-direction: column;
  gap: 6px;
  backdrop-filter: blur(8px);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.pkg-node:hover { transform: translateY(-2px); }
.pkg-head { display: flex; align-items: center; gap: 0; flex-wrap: wrap; }
.pkg-scope { font-size: 12px; font-family: 'JetBrains Mono', monospace; opacity: 0.6; font-weight: 500; }
.pkg-name { font-size: 14px; font-weight: 800; font-family: 'JetBrains Mono', monospace; margin-right: auto; }
.pkg-tag { font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.05em; margin-left: 6px; }
.pkg-desc { font-size: 11px; line-height: 1.6; color: var(--vp-c-text-2); }
.pkg-note { font-size: 10px; line-height: 1.4; margin-top: 4px; padding: 6px 8px; border-radius: 6px; font-style: normal; font-family: 'JetBrains Mono', monospace; }
.pkg-node.entry { border-color: rgba(16,185,129,0.6); background: linear-gradient(180deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.05) 100%); box-shadow: 0 0 15px rgba(16,185,129,0.1); }
.pkg-node.entry .pkg-scope { color: #34d399; }
.pkg-node.entry .pkg-name { color: #10b981; }
.pkg-tag.entry { background: rgba(16,185,129,0.2); color: #10b981; border: 1px solid rgba(16,185,129,0.5); }
.pkg-node.jf { border-color: rgba(59,130,246,0.4); background: linear-gradient(180deg, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.02) 100%); }
.pkg-node.jf .pkg-scope { color: #60a5fa; }
.pkg-node.jf .pkg-name { color: #3b82f6; }
.pkg-tag.jf { background: rgba(59,130,246,0.15); color: #3b82f6; border: 1px solid rgba(59,130,246,0.3); }
.pkg-node.mf { border-color: rgba(139,92,246,0.5); background: linear-gradient(180deg, rgba(139,92,246,0.1) 0%, rgba(139,92,246,0.02) 100%); }
.pkg-node.mf .pkg-scope { color: #a78bfa; }
.pkg-node.mf .pkg-name { color: #8b5cf6; }
.pkg-tag.mf { background: rgba(139,92,246,0.15); color: #8b5cf6; border: 1px solid rgba(139,92,246,0.4); }
.pkg-node.jf-core { border-color: rgba(100,116,139,0.3); background: rgba(100,116,139,0.05); }
.pkg-node.jf-core .pkg-scope { color: #94a3b8; }
.pkg-node.jf-core .pkg-name { color: #64748b; }
.pkg-tag.jf-core { background: rgba(100,116,139,0.15); color: #64748b; border: 1px solid rgba(100,116,139,0.3); }
.pkg-node.core { border-color: rgba(245,158,11,0.6); background: linear-gradient(180deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.03) 100%); box-shadow: 0 0 20px rgba(245,158,11,0.12); }
.pkg-node.core .pkg-scope { color: #fbbf24; }
.pkg-node.core .pkg-name { color: #f59e0b; }
.pkg-tag.core { background: rgba(245,158,11,0.2); color: #f59e0b; border: 1px solid rgba(245,158,11,0.5); }
.pkg-node.core .pkg-note { background: rgba(245,158,11,0.15); color: #d97706; border: 1px solid rgba(245,158,11,0.3); }
</style>