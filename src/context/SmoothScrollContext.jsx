// This file is now just a re-export of the portfolio implementation
// to avoid having two separate Lenis instances causing conflicts

import {
  useSmoothScroll,
  default as SmoothScrollProvider
} from '../portfolio/components/providers/SmoothScrollProvider';

export { useSmoothScroll };
export { SmoothScrollProvider };

export default { useSmoothScroll, SmoothScrollProvider }; 