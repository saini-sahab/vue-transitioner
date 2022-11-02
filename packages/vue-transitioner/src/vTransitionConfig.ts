import type { Plugin, TransitionProps } from 'vue';

type TransitionName = string;

export type VTransitionerConfig = {
  __DEV__?: boolean,
  transitions?: Record<TransitionName, {
    mode: TransitionProps['mode'],
  }>,
  slotNames?: {
    SINGLE_ITEM_PREFIX: string
    SAME_COMPONENT: string,
  },
  transitionNamePrefix?: string,
}

export enum DefaultTransitions {
  NONE = 'none',
  SLIDE_HORIZONTALLY_FORWARD = 'slideHorizontallyForward',
  SLIDE_HORIZONTALLY_BACKWARD = 'slideHorizontallyBackward',
  SLIDE_VERTICALLY_DOWN = 'slideVerticallyDown',
  SLIDE_VERTICALLY_UP = 'slideVerticallyUp',
  FLIP_CARD_FORWARD = 'flipCardForward',
  FLIP_CARD_BACKWARD = 'flipCardBackward',
  FADE_SWITCH = 'fadeSwitch',
  ZOOM_SWITCH = 'zoomSwitch',
  FADE_SCALE_LEFT = 'fadeScaleLeft',
  FADE_SCALE_RIGHT = 'fadeScaleRight',
  SLIDE_IN_ZOOM_OUT = 'slideInZoomOut',
}

const defaultConfig: Required<VTransitionerConfig> = {
  __DEV__: process.env.NODE_ENV === 'development',

  transitions: {
    [ DefaultTransitions.NONE ]: { mode: 'default' },
    [ DefaultTransitions.SLIDE_HORIZONTALLY_FORWARD ]: { mode: 'default' },
    [ DefaultTransitions.SLIDE_HORIZONTALLY_BACKWARD ]: { mode: 'default' },
    [ DefaultTransitions.SLIDE_VERTICALLY_DOWN ]: { mode: 'default' },
    [ DefaultTransitions.SLIDE_VERTICALLY_UP ]: { mode: 'default' },
    [ DefaultTransitions.FLIP_CARD_FORWARD ]: { mode: 'out-in' },
    [ DefaultTransitions.FLIP_CARD_BACKWARD ]: { mode: 'out-in' },
    [ DefaultTransitions.FADE_SWITCH ]: { mode: 'default' },
    [ DefaultTransitions.ZOOM_SWITCH ]: { mode: 'default' },
    [ DefaultTransitions.FADE_SCALE_LEFT ]: { mode: 'default' },
    [ DefaultTransitions.FADE_SCALE_RIGHT ]: { mode: 'default' },
    [ DefaultTransitions.SLIDE_IN_ZOOM_OUT ]: { mode: 'default' },
  },

  slotNames: {
    SINGLE_ITEM_PREFIX: 'vTransitionerItem_',
    SAME_COMPONENT: 'vTransitionerCommonItem'
  },

  transitionNamePrefix: 'v-transitioner--',
};

export const config = defaultConfig;
