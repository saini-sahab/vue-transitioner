<script setup lang="ts">
import { ref, defineProps, withDefaults, computed, useSlots, watch, nextTick, onMounted, type TransitionProps, Comment, useAttrs, type SetupContext } from 'vue';

import { invariant, getAnimationDirection, validateTransitionerSlots } from './utils';
import { config as privateConfig } from './vTransitionConfig';

enum VueTransitionHooks {
  onBeforeEnter = 'onBeforeEnter',
  onEnter = 'onEnter',
  onAfterEnter = 'onAfterEnter',
  onEnterCancelled = 'onEnterCancelled',

  onBeforeLeave = 'onBeforeLeave',
  onLeave = 'onLeave',
  onAfterLeave = 'onAfterLeave',
  onLeaveCancelled = 'onLeaveCancelled',

  onBeforeAppear = 'onBeforeAppear',
  onAppear = 'onAppear',
  onAfterAppear = 'onAfterAppear',
  onAppearCancelled = 'onAppearCancelled',
}

type ExcludedArrayHooks<T> = Exclude< T, T[]>
type ExcludeUndefinedFromParameters = Parameters< Exclude< BaseTransitionHooks[  keyof typeof VueTransitionHooks ], undefined > >

type BaseTransitionHooks = {
  [ key in VueTransitionHooks ]: ExcludedArrayHooks<TransitionProps[key]>
};
type VTransitionHooks = {
  [key in VueTransitionHooks]?:  ( ...args: ExcludeUndefinedFromParameters ) => void;
}

interface Props extends VTransitionHooks {
  visibleItemNumber: number,
  maxItems: number,
  forwardTransition: string | 'none',
  backwardTransition: string | 'none',

  keepAliveComponents?: boolean,
  areAllItemsSameComponent?: boolean,
  areItemsCyclic?: boolean,
  appear?: boolean,
}

const props = withDefaults( defineProps<Props> (), {
  areAllItemsSameComponent: false,
  keepAliveComponents: false,
  areItemsCyclic: false,
  appear: false,
} );

const attrs: VTransitionHooks = useAttrs();

const allEventsToBindToTransition = computed( () => {
  const events: { [ key in VueTransitionHooks ]?: BaseTransitionHooks[key] } = {};
  let hookName: keyof typeof VueTransitionHooks;

  for ( hookName of Object.values( VueTransitionHooks ) ) {
    const name = hookName;

    events[ name ] = ( ...args: ExcludeUndefinedFromParameters ) => {
      const hook = attrs[ name ];

      hook && hook( ...args )
    }
  }

  return events;
} );

checkTransition( props.forwardTransition );
checkTransition( props.backwardTransition );

const $slots = useSlots();
const currentTransitionName = ref( props.forwardTransition );
const itemNumberToShow = ref( props.visibleItemNumber );
let previousItemNumberToShow = 0;

const transitionMode = computed( () => privateConfig.transitions[ currentTransitionName.value ].mode || 'default' );

const slotName = computed( () => {
  const keyDetails = getKeyDetailsForSlotItem( itemNumberToShow.value );
  const itemNumberToUse = keyDetails.isValid ? itemNumberToShow.value : previousItemNumberToShow;
  const keyToUse = keyDetails.isValid ? keyDetails.key : getKeyDetailsForSlotItem( itemNumberToUse ).key;

  return keyToUse;
} );

watch( () => props.visibleItemNumber, ( newVal, oldVal ) => {
  const isValidVisibleItem = newVal <= props.maxItems && newVal >= 1;

  invariant( isValidVisibleItem, `VTransitioner: Invalid visibleItemNumber set as ${newVal} whereas it should be between 1 and ${props.maxItems}` );

  const animDirection = getAnimationDirection( oldVal, newVal, props.maxItems, props.areItemsCyclic );

  if ( animDirection === 'forward' ) {
    checkTransition( props.forwardTransition );
    currentTransitionName.value = props.forwardTransition;
  } else {
    checkTransition( props.backwardTransition );
    currentTransitionName.value = props.backwardTransition;
  }

  previousItemNumberToShow = itemNumberToShow.value;
  itemNumberToShow.value = newVal;
} );

watch( () => props.maxItems, async ( newVal ) => {
  await nextTick();

  validateTransitionerSlots( $slots, newVal, props.areAllItemsSameComponent );
} );

function checkTransition( transitionName: string ) {
  const isValid = transitionName === 'none' || !!privateConfig.transitions[ transitionName ];
  invariant( isValid, `VTransitioner:  ${transitionName} does not belong in the list of configured transitions` )
}

function getKeyDetailsForSlotItem( itemNumber = itemNumberToShow.value ) {
  let key = '';

  if ( props.areAllItemsSameComponent ) {
    key = privateConfig.slotNames.SAME_COMPONENT;
  } else {
    key = `${privateConfig.slotNames.SINGLE_ITEM_PREFIX}${itemNumber}`;
  }

  if ( !key || !$slots[ key ] ) {
    return { isValid: false, key };
  }

  return { isValid: true, key };
}

onMounted( () => {
  validateTransitionerSlots( $slots, props.maxItems, props.areAllItemsSameComponent );
} );

const keptAliveComponent = computed( () => {
  const slotContent = $slots[ slotName.value ]?.()

  if ( !Array.isArray( slotContent ) ) {
    return slotContent;
  }

  const withoutComments = slotContent.filter( ( node ) => node.type !== Comment );

  invariant( withoutComments.length <= 1, `Slot content for '${slotName.value}' is expected to be exactly one child element or component` );

  return withoutComments[0]
} );
</script>

<template>
  <div class="v-transitioner">
    <Transition
      :name="`${privateConfig.transitionNamePrefix}${currentTransitionName}`"
      :mode="transitionMode"
      :appear="appear"
      v-bind="allEventsToBindToTransition"
    >
      <template v-if="!keepAliveComponents">
        <slot :name="slotName" />
      </template>

      <template v-else>
        <KeepAlive>
          <Component :is="keptAliveComponent" />
        </KeepAlive>
      </template>
    </Transition>
  </div>
</template>
