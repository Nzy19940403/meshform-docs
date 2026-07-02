# Linkage API

The linkage API is where MeshForm Vue becomes more than a rendering wrapper.
This is the layer where you declare how fields depend on one another.

## `from()`

`from()` is the most direct way to express a dependency.

```ts
from('product.category', getOptions)
from('product.name', getPrice)
from(['price', 'quantity'], (price, qty) => price * qty)
```

A rule is usually registered by target property:

```ts
const rules = {
  'product.name.options': from('product.category', getOptions),
  'product.unitPrice.value': from('product.name', getPrice),
  'billing.total.value': from(['price', 'quantity'], (price, qty) => price * qty),
}
```

## What targets can be updated

Typical targets include:

- `.value`
- `.hidden`
- `.disabled`
- `.readonly`
- `.required`
- `.options`
- `.label`
- `.placeholder`

## Why this matters

The important change is not the syntax itself.
It is that the dependency is now explicit and schedulable.
That gives the engine enough information to manage order, propagation, and stabilization for you.

## Cyclic interaction

When two values influence one another, use the MeshFlow entangle-style APIs rather than ad-hoc guard code.
That keeps bidirectional logic inside the engine instead of scattering it through the UI.