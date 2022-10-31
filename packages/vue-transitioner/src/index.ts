import type { Plugin } from 'vue';

import PrivateTransitioner from './VTransitioner.vue';
import { config as privateConfig, type VTransitionerConfig } from './vTransitionConfig';
import { assign } from './utils';

export { type VTransitionerConfig, DefaultTransitions } from './vTransitionConfig';

export const VTransitioner = PrivateTransitioner;

declare module 'vue' {
  export interface App {
    $_vTransitonerInstalled?: boolean
  }
}

export const install: Plugin[ 'install' ] = ( app, config: VTransitionerConfig ) => {
  if ( app.$_vTransitonerInstalled ) {
    return;
  }

  app.$_vTransitonerInstalled = true;

  assign( privateConfig, config );

  app.component( 'VTransitioner', PrivateTransitioner )
}

const plugin = {
  // eslint-disable-next-line no-undef
  version: 1,
  install,
}

export default plugin
