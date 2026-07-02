---
title: "Demo: Entangle + DAG"
---

<script setup>
import EntangleDemo from '../../.vitepress/components/EntangleDemo.vue'
import PortfolioDemo from '../../.vitepress/components/PortfolioDemo.vue'
import PortfolioGraph from '../../.vitepress/components/PortfolioGraph.vue'
</script>

# Demo: Entangle + DAG

MeshForm Vue supports two different coordination modes, and they can coexist inside the same form:

| Mode | API | Best for |
|---|---|---|
| one-way derivation | `from()` / `define()` | stable downstream computation |
| bidirectional convergence | `engine.entangle()` | cyclic constraints and symmetric relationships |

## Basic example: three-way currency entangle

The simplest case is currency conversion. Edit any one amount, and the other two converge immediately. There is no permanent upstream field here, so a pure DAG cannot express it cleanly.

<ClientOnly>
  <EntangleDemo :en="true" />
</ClientOnly>

## Mixed example: entangled ratios + DAG derivation

Real business forms often need both models at once. In this portfolio simulator:

- allocation ratios are entangled so the three percentages always sum to 100%
- asset amounts are derived from `total × percentage`
- expected returns are derived from `amount × annualized rate`
- total return is derived from the sum of three downstream branches

<ClientOnly>
  <PortfolioDemo :en="true" />
</ClientOnly>

## Coordination graph

Purple edges represent `useEntangle()` registrations. Blue and green edges represent one-way `from()` derivations.

<ClientOnly>
  <PortfolioGraph :en="true" />
</ClientOnly>

## Why mix both?

Most fields in a serious form still belong to a directional graph. Only a small portion of relationships are truly symmetric. MeshForm Vue lets those two topologies live inside one engine instead of forcing everything into watchers or into an unnatural DAG.