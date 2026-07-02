<script setup>
import WhyGraph from '../../.vitepress/components/WhyGraph.vue'
</script>

# Why MeshForm Vue

## The usual failure mode of complex forms

In back-office systems, the hardest part of a form is often not rendering a field.
It is keeping the interaction logic understandable once fields begin to affect one another.

A typical watch-based implementation usually suffers from:

- implicit execution order
- stale async responses
- cyclic dependencies that need manual guard code
- logic spread across many components and temporary states

## Make linkage explicit

Instead of hiding behavior inside `watch`, MeshForm Vue turns field interaction into an explicit dependency graph:

```ts
engine.define({
  'product.name.options': from('product.category', getOptions),
  'product.unitPrice.value': from('product.name', getPrice),
  'billing.total.value': from(['product.quantity', 'product.unitPrice'], (q, p) => q * p),
  'discount.amount.hidden': from('discount.type', t => t === 'none'),
})
```

<ClientOnly>
  <WhyGraph lang="en" />
</ClientOnly>

That buys you three important properties:

- deterministic execution order
- safer async propagation
- explainable downstream impact from any field

## Compared with common alternatives

| Capability | MeshForm Vue | Plain `@jsonforms/vue` | Hand-written `watch` |
| --- | --- | --- | --- |
| Dependency graph | Yes | No built-in orchestration | Implicit |
| Ordered propagation | Yes | Limited | Fragile |
| Cyclic convergence | Yes | No | Manual |
| JSON Schema driven | Yes | Yes | No |
| Migration from JSON Forms | Low | N/A | Rewrite |

If your form is simple CRUD, JSON Forms alone may already be enough.
If your form behaves like a stateful business workflow, MeshForm Vue gives you a more stable ceiling.