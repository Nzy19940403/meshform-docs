# API

This page is a high-level map of the public surface used most often in MeshForm Vue.

## Main exports

From `@meshflow/form-vue` you will most commonly use:

- `MeshForm`
- `from`
- `MeshFormSchema`
- `FromDescriptor`

## Common patterns

### Build a schema

```ts
const schema: MeshFormSchema = { ... }
```

### Register rules

```ts
const rules: Record<string, FromDescriptor> = {
  'target.value': from('source', logic),
}
```

### Render a form

```vue
<MeshForm :schema="schema" :rules="rules" />
```

## Related pages

- [Schema](./schema)
- [Linkage API](./linkage)
- [MeshForm Component](./mesh-form)
- [Custom Renderer](./custom-renderer)

As the library evolves, this page can grow into a more exhaustive reference.
For now, the guide pages above are the practical entry points.