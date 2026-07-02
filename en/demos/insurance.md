---
title: "Demo: Life Insurance Application"
---

<script setup>
import InsuranceForm from '../../.vitepress/components/InsuranceForm.vue'
import InsuranceLinkageGraph from '../../.vitepress/components/InsuranceLinkageGraph.vue'
</script>

# Demo: Life Insurance Application

A realistic insurance application flow with linked underwriting inputs, premium adjustments, beneficiary logic, and multi-step premium derivation.

## Live demo

<ClientOnly>
  <InsuranceForm :en="true" />
</ClientOnly>

## Dependency graph

<ClientOnly>
  <InsuranceLinkageGraph :en="true" />
</ClientOnly>

## Why it matters

This case shows why complex forms stop being a rendering problem. Age, occupation risk, BMI, rider switches, and payment frequency all contribute to the final premium chain.