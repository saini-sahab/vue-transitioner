# Vue Transitioner

vue-transitioner is a vue3 component to ease adding animation between any components

<br />

### Installation
Use your package manager of choice 
```sh
npm install vue-transitioner --dev
```

## Usage
You can use the component in 2 ways

#### Directly importing the component
```html
<script setup lang="ts">
  import { VTransitioner, DefaultTransitions } from 'vue-transitioner';

  // Import the style files if you are using the default transitions
  import 'vue-transitioner/styles/flipCardForward.css'
  import 'vue-transitioner/styles/flipCardBackward.css'
</script>

<template>
  <VTransitioner
    :maxItems="2"
    :visibleItemNumber="visibleItemNumber"
    :forwardTransition="DefaultTransitions.FLIP_CARD_FORWARD"
    :backwardTransition="DefaultTransitions.FLIP_CARD_BACKWARD"
    :keepAliveComponents="true"
  >
    <template #vTransitioner_1>
      <img src="cat.gif" />
    </template>

    <template #vTransitioner_2>
      <img src="dog.gif" />
    </template>
  </VTransitioner>
</template>
```

#### Or using the plugin
```js
import { createApp, h } from 'vue';
import VTransitionerPlugin from 'vue-transitioner';

const app = createApp( { render: () => h( App ) } );

app.use( VTransitionerPlugin, {
  transitions: {
    bounce: { mode: 'in-out' },
    swivel: { mode: 'default' }
  }
} );
```
and then use the component anywhere


<br/>

## Props

| Prop                  | Type      | Default     | Description                              |
|-----------------------|-----------|-------------|------------------------------------------|
| visibleItemNumber     | number <br/><br/> *1 < visibleItemNumber < maxItems*    | (required)  | The item number that is visible. Determines which component is rendered|
| maxItems              | number    | (required)  | The max number of items that can be transitioned from
| forwardTransition     | string <br /><br/> *One of config.transitions* | (required) | The name of the transition that will be used when the visibleItemNumber value increases
| backwardTransition    | string <br /><br/> *One of config.transitions* | (required) | The name of the transition that will be used when the visibleItemNumber value decreases
| keepAliveComponents  | boolean   | false | If true will use 'KeepAlive' to keep the components in cache |
| areAllItemsSameComponent | boolean | false | Should be true if all the items being transitioned use the same component with different props. Useful when transitions are needed for list items |
| areItemsCyclic   | boolean | false | Should be true if the items loop again after the end. Needed to determine forward or backward transition b/w edge items |
| appear  | boolean | false | Same as appear prop from native vue 'Transition' |

## Plugin config

| Key                   | Type      | Default     | Description                              |
|-----------------------|-----------|-------------|------------------------------------------|
| __DEV__?             | boolean   | `process.env.NODE_ENV === 'development'`| Whether the project is running in development environment. Will alter the warning and errors thrown |
| transitions?           | `Record<string, { mode: 'in-out' | 'out-in' | 'default' }>` | Includes all DefaultTransitions | This is the list of aalowed transitions that the vTransitioner can use. Any forward or backward transition will need to be one of this list |
| slotNames.SINGLE_ITEM_PREFIX | string | 'vTransitionerItem_' | The prefix which will be used when looking up slot names of the items being transitioned |
| slotNames.SAME_COMPONENT | string | 'vTransitionerCommonItem' | The name of the slot to be used when the `areAllItemsSameComponent` is true |
| transitionNamePrefix | string | 'v-transitioner--' | The prefix of the css class name that will be used for defining the transitions |