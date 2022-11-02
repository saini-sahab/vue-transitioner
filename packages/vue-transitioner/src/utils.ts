import { Comment, type VNode, type Slots } from 'vue';

import { config as privateConfig } from './vTransitionConfig';

export function isVNodeForComments( vNode: VNode ) {
  return vNode.type === Comment;
}

export function assign<T = Record<string, any>> ( to: T, from: T ) {
  for ( const key in from ) {
    if ( Object.prototype.hasOwnProperty.call( from, key ) ) {
      if ( typeof from[key] === 'object' && to[key] ) {
        assign( to[key], from[key] )
      } else {
        to[key] = from[key]
      }
    }
  }
}

export function validateTransitionerSlots( $slots: Slots, maxItems: number, areAllItemsSameComponent: boolean ) {
  if ( !privateConfig.__DEV__ ) {
    return;
  }

  const defaultSlotIsNotPresent = !$slots.default || isVNodeForComments( $slots.default()[ 0 ] );

  invariant( defaultSlotIsNotPresent, `VTransitioner: default slots are not allowed for VTransitioner. Either name them individually using "${privateConfig.slotNames.SINGLE_ITEM_PREFIX}[number]" or use "${privateConfig.slotNames.SAME_COMPONENT}" for common component. Found of type - ${$slots.default && String( $slots.default()[ 0 ].type )}` );

  if ( areAllItemsSameComponent ) {
    const isCommonComponentSlotPresent = !!$slots[ privateConfig.slotNames.SAME_COMPONENT ];

    invariant( isCommonComponentSlotPresent, `VTransitioner: when all items use the same component - slot name ${privateConfig.slotNames.SAME_COMPONENT} is required but not found` );

    return;
  }

  const slotNames = Object.keys( $slots );

  for ( let i = 0, l = slotNames.length; i < l; i++ ) {
    const name = slotNames[i];
    const prefix = name.slice( 0, privateConfig.slotNames.SINGLE_ITEM_PREFIX.length );
    const isValidPrefix = prefix === privateConfig.slotNames.SINGLE_ITEM_PREFIX;

    const suffix = name.slice( privateConfig.slotNames.SINGLE_ITEM_PREFIX.length );
    const suffixNumber = parseInt( suffix, 10 );
    const isValidSuffix = !isNaN( suffixNumber ) && ( suffixNumber >= 1 && suffixNumber <= maxItems );

    invariant( isValidPrefix && isValidSuffix, `
      VTransitioner: the slot name (${name}) is not valid.
      1. Prefix should be "${privateConfig.slotNames.SINGLE_ITEM_PREFIX}" but received (${prefix}).
      2. Suffix should be a number n equivalent: 1 <= n <= ${maxItems} but received (${suffix})
    ` );
  }
}

export function invariant( condition: boolean, messageWhenItFails: string | Array<any> = '' ) {
  if ( condition === true ) {
    return;
  }

  const logArgs = messageWhenItFails instanceof Array ? messageWhenItFails : [ messageWhenItFails ];

  if ( !privateConfig.__DEV__ ) {
    console.error( [ '[VTransitioner] Invariant Violation:', ...logArgs ] );

    return;
  }

  const error = new Error();
  error.name = '[VTransitioner] Invariant Violation';
  error.message = logArgs.join( ' ' );

  throw error;
}

export function getAnimationDirection( currentItemNumber: number, nextItemNumber: number, maxItems: number, areItemsCyclic: boolean ): ( 'forward' | 'backward' ) {
  if ( !areItemsCyclic ) {
    return ( nextItemNumber - currentItemNumber ) > 0 ? 'forward' : 'backward';
  }

  const cycle = getRoundRobinCycle( currentItemNumber, maxItems );
  const indexOfCurrentItem = cycle.findIndex( ( num ) => num === currentItemNumber );
  const indexOfNextItem = cycle.findIndex( ( num ) => num === nextItemNumber );

  if ( cycle.length <= 2 ) {
    return 'forward';
  }

  return ( indexOfNextItem - indexOfCurrentItem ) > 0 ? 'forward' : 'backward';
}

function getRoundRobinCycle( currentItemNumber: number, maxItems: number ) {
  const cycle = [];

  for ( let i = 1, l = maxItems + 1; i < l; i++ ) {
    cycle.push( i );
  }

  const indexOfMiddle = Math.ceil( ( maxItems - 1 ) / 2 );
  const indexOfCurrentItem = currentItemNumber - 1;
  const diffInMiddleAndCurrent = indexOfMiddle - indexOfCurrentItem;

  for ( let i = 0; i < Math.abs( diffInMiddleAndCurrent ); i++ ) {
    const methodToRemove = diffInMiddleAndCurrent > 0 ? 'pop' : 'shift';
    const methodToAdd = diffInMiddleAndCurrent > 0 ? 'unshift' : 'push';
    const itemRemoved = cycle[ methodToRemove ]();
    cycle[ methodToAdd ]( <number>itemRemoved );
  }

  return cycle;
}
