<script setup>
import QuickDemo from '../../.vitepress/components/QuickDemo.vue'
</script>

# Quick Start

## See the behavior first

Three or four fields are enough to show the core idea: user input, derived values, and deterministic propagation.

<ClientOnly>
  <QuickDemo lang="en" />
</ClientOnly>

## Install

```bash
npm install @meshflow/form-vue
```

Install peer dependencies:

```bash
npm install vue@^3 vuetify@^3 @jsonforms/core@^3 @jsonforms/vue@^3 @meshflow/core @meshflow/form
```

## Minimal example

```vue
<template>
  <MeshForm :schema="schema" :rules="rules" @submit="onSubmit">
    <template #actions="{ submit }">
      <v-btn color="primary" @click="submit">Submit</v-btn>
    </template>
  </MeshForm>
</template>

<script setup lang="ts">
import { MeshForm, from } from '@meshflow/form-vue'
import type { MeshFormSchema, FromDescriptor } from '@meshflow/form-vue'

const schema: MeshFormSchema = {
  type: 'object',
  properties: {
    category: {
      type: 'string',
      title: 'Category',
      default: 'software',
      'x-widget': 'select',
      'x-options': [
        { label: 'Software', value: 'software' },
        { label: 'Hardware', value: 'hardware' },
      ],
    },
    product: {
      type: 'string',
      title: 'Product',
      'x-widget': 'select',
      'x-options': [],
    },
    price: { type: 'number', title: 'Unit Price', default: 0, 'x-readonly': true },
    quantity: { type: 'integer', title: 'Quantity', default: 1 },
    total: { type: 'number', title: 'Total', default: 0, 'x-readonly': true },
  },
}

const rules: Record<string, FromDescriptor> = {
  'product.options': from('category', getOptions),
  'price.value': from('product', getPrice),
  'total.value': from(['price', 'quantity'], (price, qty) => price * qty),
}

function onSubmit(data: Record<string, any>) {
  console.log(data)
}
</script>
```

## What happens under the hood

- `from()` declares explicit dependencies between fields
- `:rules` registers them with the engine
- MeshFlow decides execution order and propagation
- the view layer only consumes the resulting state

## Next steps

- [Why MeshForm Vue](./why)
- [Architecture](./architecture)
- [Schema](./schema)
- [Linkage API](./linkage)