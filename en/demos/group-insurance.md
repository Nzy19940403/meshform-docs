---
title: "Demo: Group Insurance Pricing"
---

<script setup>
import GroupInsuranceForm from '../../.vitepress/components/GroupInsuranceForm.vue'
import GroupInsuranceLinkageGraph from '../../.vitepress/components/GroupInsuranceLinkageGraph.vue'
</script>

# Demo: Group Insurance Pricing

A multi-product enterprise insurance quote with rate factors, bundled discounts, insured-headcount derivation, and tax-deduction calculations.

## Live demo

<ClientOnly>
  <GroupInsuranceForm :en="true" />
</ClientOnly>

## Dependency graph

<ClientOnly>
  <GroupInsuranceLinkageGraph :en="true" />
</ClientOnly>

## Why it matters

This example is mostly about aggregation pressure: many insurance products, several adjustment factors, and one pricing summary that must stay consistent while every upstream choice changes.