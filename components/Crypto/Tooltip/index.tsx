'use client';

import useFormatMoney from '@/hooks/useFormatMoney';
import type { Props } from '@/types/components/Crypto/Tooltip';

export default function Tooltip({
  selectedLegend,
  openingColor,
  closingColor,
  time,
  open,
  close,
  innerRef,
}: Props) {
  return (
    <g ref={innerRef}>
      <svg
        width="111"
        height="34"
        style={{
          pointerEvents: 'none',
          outline: `1px solid ${selectedLegend === 'Opening' ? openingColor : closingColor}`,
        }}
      >
        <rect width="100%" height="100%" fill="rgba(0,0,0,.6)" />
        <text
          x="0"
          y="0"
          dy="1.2em"
          fill="#FFF2D2"
          fontSize="11px"
          letterSpacing="0.2px"
          transform="translate(5, 0)"
        >
          Time: {time || 'n/a'}
        </text>
        <text
          x="0"
          y="0"
          dy="2.4em"
          fill="#FFF2D2"
          fontSize="11px"
          letterSpacing="0.2px"
          transform="translate(5, 0)"
        >
          {selectedLegend === 'Opening'
            ? // eslint-disable-next-line react-hooks/rules-of-hooks -- custom hook
              `Open: $${useFormatMoney(open, 3)}`
            : // eslint-disable-next-line react-hooks/rules-of-hooks -- custom hook
              `Close: $${useFormatMoney(close, 3)}`}
        </text>
      </svg>
    </g>
  );
}
