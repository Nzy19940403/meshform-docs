---
layout: home

hero:
  name: "MeshForm Vue"
  text: "Deterministic state orchestration for JSON Forms"
  tagline: "A drop-in enhancement layer for complex business forms in Vue 3. Keep JSON Schema, UISchema, and custom renderers. Let MeshFlow handle field dependencies, async propagation, and convergence."
  image:
    src: /logo.svg
    alt: MeshForm Vue Logo
  actions:
    - theme: brand
      text: Quick Start
      link: /en/guide/getting-started
    - theme: alt
      text: Architecture
      link: /en/guide/architecture

features:
  - title: "Drop-in for @jsonforms/vue"
    icon: "🧩"
    details: "Keep your existing schema, UISchema, and renderer stack. Add :rules and move complex linkage into MeshFlow."
  - title: "Deterministic dependency scheduling"
    icon: "🕸️"
    details: "Handle ordered propagation over a field graph instead of scattering logic across watch chains and temporary state."
  - title: "Async-safe updates"
    icon: "⏱️"
    details: "Avoid stale async responses overwriting newer user state when options, prices, or validations load remotely."
  - title: "Bidirectional convergence"
    icon: "↔️"
    details: "Model cyclic constraints explicitly and let the engine converge instead of guarding everything by hand."
---

<script setup>
import ArchGraph from '../.vitepress/components/ArchGraph.vue'
</script>

## Complex forms break down in state evolution, not rendering

MeshForm Vue is not trying to replace JSON Forms from scratch.
It adds the missing orchestration layer for teams whose forms have become small stateful systems.

That usually starts when fields begin to influence one another:

- one field refreshes the options of another
- one choice controls visibility, readonly state, and validation elsewhere
- async lookups race with newer user input
- derived values must update in a stable order
- bidirectional constraints need convergence rather than guard-heavy UI code

## Built for dense business linkage

MeshForm Vue shines in forms such as:

- insurance underwriting and application flows
- procurement, quote, and pricing workflows
- product configuration and eligibility forms
- internal systems with dense cross-field derivation
- teams already using `@jsonforms/vue` but hitting the limits of hand-written linkage code

## Architecture: separate computation from rendering

<ClientOnly>
  <ArchGraph lang="en" />
</ClientOnly>

MeshForm Vue keeps JSON Forms focused on rendering and delegates dependency propagation to MeshFlow.
That makes business rules easier to test, interaction chains easier to explain, and complex updates less fragile.