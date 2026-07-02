---
title: "Demo: Engineering Quote"
---

<script setup>
import EngineeringQuoteForm from '../../.vitepress/components/EngineeringQuoteForm.vue'
import EngineeringQuoteLinkageGraph from '../../.vitepress/components/EngineeringQuoteLinkageGraph.vue'
</script>

# Demo: Engineering Quote

A larger mixed-topology case with deep DAG cost derivation plus two real bidirectional constraints: margin versus quote price, and project duration versus team size.

## Live demo

<ClientOnly>
  <EngineeringQuoteForm :en="true" />
</ClientOnly>

## Dependency graph

<ClientOnly>
  <EngineeringQuoteLinkageGraph :en="true" />
</ClientOnly>

## Why it matters

This is where MeshForm Vue starts to feel different from a watch-based form stack. Most of the graph is directional, but a few relationships are genuinely symmetric and need a different execution model.