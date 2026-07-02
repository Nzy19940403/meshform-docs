<script setup>
import ArchGraph from '../../.vitepress/components/ArchGraph.vue'
</script>

# Architecture

## Layered structure

MeshForm Vue is split into three packages with clear boundaries:

- `@meshflow/core`: framework-agnostic scheduling engine
- `@meshflow/form`: schema and linkage adapter
- `@meshflow/form-vue`: Vue 3 integration on top of JSON Forms

<ClientOnly>
  <ArchGraph lang="en" />
</ClientOnly>

## `@meshflow/core`: the engine

The engine is built around a directed dependency graph.
Fields become nodes, and `from()` declarations become dependency edges.

It supports two important cases:

- DAG-style one-way dependencies with deterministic scheduling
- cyclic interaction through convergence semantics

This is what lets MeshForm Vue stay stable under dense linkage and async behavior.

## `@meshflow/form`: the adapter

This layer translates `MeshFormSchema` and linkage declarations into engine-readable nodes.
It is responsible for:

- schema-to-node conversion
- property-level targets such as `.value`, `.hidden`, `.disabled`, `.required`, and `.options`
- turning declarative `from()` rules into engine registrations

## `@meshflow/form-vue`: the bridge

This layer owns the Vue integration and wraps `@jsonforms/vue`.
It creates the engine, registers rules, publishes node state to renderers, and keeps rerenders aligned with engine updates.

The result is a clean separation:

- MeshFlow computes state
- JSON Forms renders state
- custom renderers consume the node map instead of inventing their own linkage model