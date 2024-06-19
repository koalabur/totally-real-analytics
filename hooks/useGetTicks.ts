import * as d3 from 'd3';

import type { Data } from '@/types/components/Crypto/Linechart';

export default function useGetTicks(
  accessor: (d: Data) => number,
  data: Data[] | undefined,
) {
  let ticks = 8;
  const minMax = d3.extent(data!, accessor);
  const [a, b] = minMax;
  const diff = Number(b) - Number(a);

  if (diff <= 3) {
    ticks = 3;
  }

  if (diff > 3) {
    ticks = 8;
  }

  return ticks;
}
