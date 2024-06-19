'use client';

import type { Props } from '@/types/components/Crypto/Dot';

export default function Dot({
  selectLegend,
  openingColor,
  closingColor,
  innerRef,
}: Props) {
  return (
    <circle
      ref={innerRef}
      fill={selectLegend === 'Opening' ? openingColor : closingColor}
      stroke="#FFF2D2"
      strokeWidth="1"
      r="4"
      cx="0"
      cy="0"
    />
  );
}
