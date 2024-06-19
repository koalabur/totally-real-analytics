import type { Ref } from 'react';

export interface Props {
  selectLegend: string;
  openingColor: string;
  closingColor: string;
  innerRef: Ref<SVGCircleElement>;
}
