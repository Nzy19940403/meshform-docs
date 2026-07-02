# Schema

`MeshFormSchema` is JSON Schema with a small set of form-oriented extensions.
That means teams can stay within a familiar schema-driven model while gaining explicit linkage capabilities.

## What stays the same

You still define:

- `type`
- `properties`
- nested objects
- default values
- titles and descriptions

## Common `x-*` extensions

MeshForm Vue adds metadata that helps build the rendered form:

| Field | Purpose |
| --- | --- |
| `x-widget` | choose a widget such as `select` |
| `x-options` | provide select options |
| `x-layout` | influence generated layout |
| `x-readonly` | mark a field readonly |
| `x-disabled` | mark a field disabled |
| `x-theme` | pass visual hints to the renderer |

## Example

```ts
const schema: MeshFormSchema = {
  type: 'object',
  properties: {
    product: {
      type: 'object',
      title: 'Product',
      'x-layout': 'horizontal',
      properties: {
        category: {
          type: 'string',
          title: 'Category',
          'x-widget': 'select',
          'x-options': [
            { label: 'Software', value: 'software' },
            { label: 'Hardware', value: 'hardware' },
          ],
        },
      },
    },
  },
}
```

## Important boundary

Schema describes structure and presentation hints.
Linkage rules describe how state evolves.
Keeping those responsibilities separate is a core part of the design.