'use client';

import type { Props } from '@/types/components/Crypto/Crosshair';

export default function Crosshair({ innerRef }: Props) {
  return (
    <path
      ref={innerRef}
      style={{
        stroke: '#FFF2D2',
        strokeWidth: '1px',
        strokeDasharray: '4 4',
      }}
    />
  );
}
