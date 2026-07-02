---
title: "Demo: Pension Planning"
---

<script setup>
import PensionForm from '../../.vitepress/components/PensionForm.vue'
import PensionLinkageGraph from '../../.vitepress/components/PensionLinkageGraph.vue'
</script>

# Demo: Pension Planning

A retirement planning form that combines forward projection and reverse planning on top of one shared parameter set.

## Live demo

<ClientOnly>
  <PensionForm :en="true" />
</ClientOnly>

## Dependency graph

<ClientOnly>
  <PensionLinkageGraph :en="true" />
</ClientOnly>

## Why it matters

This is a good example of two calculation directions living inside one experience: one branch answers “what will I get,” while the other answers “what do I still need to contribute.”