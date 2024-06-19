import type { Ref } from 'react';

export interface Props {
  selectedLegend: string;
  openingColor: string;
  closingColor: string;
  time: string;
  open: number;
  close: number;
  innerRef: Ref<SVGGElement>;
}
