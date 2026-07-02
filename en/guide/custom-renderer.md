# Custom Renderer

MeshForm Vue stays compatible with the JSON Forms renderer model.
That means your renderer strategy does not need to be reinvented just because linkage has moved into MeshFlow.

## Basic shape

A custom renderer usually has three pieces:

1. a tester that decides when it applies
2. a Vue component that renders the field
3. a registry entry passed to `MeshForm`

## Example

```ts
const myTester = rankWith(20, and(
  uiTypeIs('Control'),
  schemaMatches(s => s['x-widget'] === 'my-widget'),
))

const customRenderers = [
  { tester: myTester, renderer: markRaw(MyRenderer) },
]
```

```vue
<MeshForm :schema="schema" :rules="rules" :renderers="customRenderers" />
```

## Reading node state

A renderer can consume node state through the injected node map.
That lets it read fields such as:

- `value`
- `hidden`
- `disabled`
- `readonly`
- `required`

The key point is that the renderer stays a consumer of state, while MeshFlow remains the owner of state evolution.