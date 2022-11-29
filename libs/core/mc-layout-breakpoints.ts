/* eslint-disable */
import { DEFAULT_BREAKPOINTS, BREAKPOINTS, BreakPoint /*, validateSuffixes */ } from '@angular/flex-layout';

/**
 * Custom breakpoints for angular/flex-layout package
 *
 * DANGER!!! xs, sm, md, etc also defined at file:
 * app/core/scss/mixins/_breakpoints.scss
 */
function updateBreakpoints(bp: BreakPoint) {
  switch (bp.alias) {
    case 'xs':
      bp.mediaQuery = '(max-width: 499px)';
      break;
    case 'sm':
      bp.mediaQuery = '(min-width: 499px) and (max-width: 959px)';
      break;
    case 'lt-sm':
      bp.mediaQuery = '(max-width: 499px)';
      break;
    case 'gt-xs':
      bp.mediaQuery = '(min-width: 500px)';
      break;
  }
  return bp;
}

/*
export function customizeBreakPoints() {
  return validateSuffixes(DEFAULT_BREAKPOINTS.map( updateBreakpoints ));
}
*/

export const MC_LAYOUT_BREAKPOINTS_PROVIDER = {
  provide: BREAKPOINTS,
  // useFactory : customizeBreakPoints
  useValue: DEFAULT_BREAKPOINTS.map(updateBreakpoints),
};
