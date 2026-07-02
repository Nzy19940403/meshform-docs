# MeshForm Component

`<MeshForm>` is the main component exported by `@meshflow/form-vue`.
It connects MeshFlow state to `@jsonforms/vue` and owns the engine lifecycle.

## Props

| Prop | Type | Required | Purpose |
| --- | --- | --- | --- |
| `schema` | `MeshFormSchema` | Yes | form schema |
| `data` | `Record<string, any>` | No | initial form data |
| `rules` | `Record<string, FromDescriptor>` | No | linkage rules |
| `uischema` | `UISchemaElement` | No | custom UI schema |
| `renderers` | `JsonFormsRendererRegistryEntry[]` | No | custom renderers |

## Events

| Event | Payload | Purpose |
| --- | --- | --- |
| `@change` | `data: Record<string, any>` | fires after engine updates settle |
| `@submit` | `data: Record<string, any>` | fires when `submit()` is invoked |

## Slots

| Slot | Slot props | Purpose |
| --- | --- | --- |
| `#actions` | `{ submit, getFormData }` | action area such as buttons |

## Example

```vue
<MeshForm :schema="schema" :rules="rules" @submit="handleSubmit">
  <template #actions="{ submit }">
    <v-btn color="primary" @click="submit">Submit</v-btn>
  </template>
</MeshForm>
```

## Migration from JSON Forms

If you are already using `@jsonforms/vue`, the migration path is intentionally small:

- keep your schema
- keep your custom renderers
- keep your UISchema if you already have one
- replace `<json-forms>` with `<MeshForm>`
- add `:rules` for dependency logic