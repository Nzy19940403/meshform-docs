---
title: "Demo: Cloud Procurement Form"
---

<script setup>
import DemoOrderForm from '../../.vitepress/components/DemoOrderForm.vue'
import LinkageGraph from '../../.vitepress/components/LinkageGraph.vue'
</script>

# Demo: Cloud Procurement Form

A compact procurement form with four different linkage patterns working together in one schema-driven flow:

- cascading selection: changing the category refreshes product options and resets invalid values
- derived pricing: quantity and unit price feed subtotal and total in a stable order
- conditional visibility: discount amount and installment fields appear only when they are relevant
- conditional calculation: monthly payment is only derived when the payment method is monthly installments

## Live demo

Change the category, switch discount types, and toggle payment methods to see how the form evolves without ad-hoc watchers.

<ClientOnly>
  <DemoOrderForm :en="true" />
</ClientOnly>

## Dependency graph

Solid blue edges propagate values. Dashed amber edges control visibility.

<ClientOnly>
  <LinkageGraph :en="true" />
</ClientOnly>

## Why this example matters

This is not a giant enterprise demo, but it shows the exact boundary where ordinary form code starts getting messy: option refresh, reset-on-invalid, derived values, and stateful visibility all intersect in one place.

With MeshForm Vue, the schema still describes structure, while rules describe evolution.