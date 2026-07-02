import { defineConfig } from 'vitepress'

const zhSidebar = [
  {
    text: '快速上手',
    items: [
      { text: '快速开始', link: '/guide/getting-started' },
      { text: '为什么选择 MeshForm Vue', link: '/guide/why' },
    ],
  },
  {
    text: '核心概念',
    items: [
      { text: '架构设计', link: '/guide/architecture' },
      { text: 'Schema', link: '/guide/schema' },
      { text: '联动 API', link: '/guide/linkage' },
      { text: 'MeshForm 组件', link: '/guide/mesh-form' },
      { text: '自定义 Renderer', link: '/guide/custom-renderer' },
    ],
  },
  {
    text: 'API 参考',
    items: [
      { text: '完整 API', link: '/guide/api' },
    ],
  },
  {
    text: 'Demos',
    items: [
      { text: '云资源采购单', link: '/demos/order-form' },
      { text: 'Entangle: DAG + 双向纠缠', link: '/demos/entangle' },
      { text: '人寿保险投保申请', link: '/demos/insurance' },
      { text: '企业团险组合定价', link: '/demos/group-insurance' },
      { text: '养老金双向规划', link: '/demos/pension' },
      { text: '工程报价单（DAG + 纠缠）', link: '/demos/engineering-quote' },
    ],
  },
]

const enSidebar = [
  {
    text: 'Getting Started',
    items: [
      { text: 'Quick Start', link: '/en/guide/getting-started' },
      { text: 'Why MeshForm Vue', link: '/en/guide/why' },
    ],
  },
  {
    text: 'Core Concepts',
    items: [
      { text: 'Architecture', link: '/en/guide/architecture' },
      { text: 'Schema', link: '/en/guide/schema' },
      { text: 'Linkage API', link: '/en/guide/linkage' },
      { text: 'MeshForm Component', link: '/en/guide/mesh-form' },
      { text: 'Custom Renderer', link: '/en/guide/custom-renderer' },
    ],
  },
  {
    text: 'API Reference',
    items: [
      { text: 'Full API', link: '/en/guide/api' },
    ],
  },
  {
    text: 'Demos',
    items: [
      { text: 'Cloud Procurement Form', link: '/en/demos/order-form' },
      { text: 'Entangle + DAG', link: '/en/demos/entangle' },
      { text: 'Life Insurance Application', link: '/en/demos/insurance' },
      { text: 'Group Insurance Pricing', link: '/en/demos/group-insurance' },
      { text: 'Pension Planning', link: '/en/demos/pension' },
      { text: 'Engineering Quote (DAG + Entangle)', link: '/en/demos/engineering-quote' },
    ],
  },
]

export default defineConfig({
  title: 'MeshForm Vue',
  description: 'Deterministic state orchestration for JSON Forms in Vue 3.',
  vite: {
    ssr: {
      noExternal: ['@vue-flow/core', 'vuetify', '@meshflow/form-vue', '@meshflow/form', '@meshflow/core'],
    },
  },
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#0a0a0f' }],
    ['meta', { name: 'keywords', content: 'json forms, vue 3 forms, schema forms, dynamic forms, state orchestration, field dependencies' }],
    ['meta', { property: 'og:title', content: 'MeshForm Vue' }],
    ['meta', { property: 'og:description', content: 'Deterministic state orchestration for JSON Forms in Vue 3.' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&display=swap' }],
  ],
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '指南', link: '/guide/getting-started' },
          { text: 'API', link: '/guide/api' },
          {
            text: 'Demo',
            items: [
              { text: '云资源采购单', link: '/demos/order-form' },
              { text: 'Entangle 双向纠缠', link: '/demos/entangle' },
              { text: '人寿保险投保申请', link: '/demos/insurance' },
              { text: '企业团险组合定价', link: '/demos/group-insurance' },
              { text: '养老金双向规划', link: '/demos/pension' },
              { text: '工程报价单（DAG + 纠缠）', link: '/demos/engineering-quote' },
            ],
          },
          { text: 'English', link: '/en/' },
        ],
        sidebar: zhSidebar,
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Guide', link: '/en/guide/getting-started' },
          { text: 'API', link: '/en/guide/api' },
          {
            text: 'Demos',
            items: [
              { text: 'Cloud Procurement Form', link: '/en/demos/order-form' },
              { text: 'Entangle + DAG', link: '/en/demos/entangle' },
              { text: 'Life Insurance Application', link: '/en/demos/insurance' },
              { text: 'Group Insurance Pricing', link: '/en/demos/group-insurance' },
              { text: 'Pension Planning', link: '/en/demos/pension' },
              { text: 'Engineering Quote (DAG + Entangle)', link: '/en/demos/engineering-quote' },
            ],
          },
          { text: '中文', link: '/' },
        ],
        sidebar: enSidebar,
      },
    },
  },
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Nzy19940403/meshflow' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@meshflow/form-vue' },
    ],
    footer: {
      message: 'MeshForm Vue - deterministic state orchestration for JSON Forms',
      copyright: 'AGPL-3.0-or-later',
    },
  },
})