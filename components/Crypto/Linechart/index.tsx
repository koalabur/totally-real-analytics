'use client';

import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';

import useFormatMoney from '@/hooks/useFormatMoney';
import useGetTicks from '@/hooks/useGetTicks';
import type { Data } from '@/types/components/Crypto/Linechart';

import Crosshair from '../Crosshair';
import Dot from '../Dot';
import Nav from '../Nav';
import Tooltip from '../Tooltip';
import styles from './index.module.scss';

export default function Linechart() {
  const [error, setError] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('BTC/USD');
  const cryptoTitles = [
    { title: 'Bitcoin', symbol: 'BTC/USD' },
    { title: 'Ethereum', symbol: 'ETH/USD' },
    { title: 'Litecoin', symbol: 'LTC/USD' },
    { title: 'SushiSwap', symbol: 'SUSHI/USD' },
  ];

  // Fetch Data - CLient Side
  const [data, setData] = useState<Array<Data>>();
  useEffect(() => {
    const url = `https://data.alpaca.markets/v1beta3/crypto/us/bars?symbols=${selectedCrypto}&timeframe=5Min&sort=asc`;
    const options = { method: 'GET', headers: { accept: 'application/json' } };
    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        setData(Array.from(json.bars[`${selectedCrypto}`]));
      })
      .catch((err) => {
        setError(true);
        console.error(err);
      });
  }, [selectedCrypto]);

  const updateCrypto = (crypto: string) => {
    setSelectedCrypto(
      cryptoTitles.find((c) => c.title === crypto)?.symbol || '',
    );
  };
  const [selectedLegend, setSelectedLegend] = useState('Opening');
  const legendUpdated = (legend: string) => {
    setSelectedLegend(legend);
  };

  // SVG Container Dimensions
  const margin = { top: 55, right: 30, bottom: 30, left: 80 };
  const width = 951;
  const height = 448;
  const boundsWidth = width - margin.right - margin.left;
  const boundsHeight = height - margin.top - margin.bottom;
  const openingColor = '#BF9180';
  const closingColor = '#04BFAD';

  const xAxisRef = useRef<SVGSVGElement>(null);
  const yAxisRef = useRef<SVGSVGElement>(null);
  const tooltipWrapperRef = useRef<SVGGElement>(null);
  const rectRef = useRef<SVGRectElement>(null);
  const veritcalLineRef = useRef<SVGPathElement>(null);
  const horizontalLineRef = useRef<SVGPathElement>(null);
  const linePath = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  // Accessor Functions
  const xAccessor = (d: Data) => d3.isoParse(d.t);
  const openingYAccessor = (d: Data) => d.o;
  const closingYAccessor = (d: Data) => d.c;

  // Scales
  const openingYScale = data
    ? d3
        .scaleLinear()
        .domain(d3.extent(data, openingYAccessor) as [number, number])
        .range([boundsHeight, 0])
    : undefined;

  const closingYScale = data
    ? d3
        .scaleLinear()
        .domain([
          d3.min(data, (d) => d.c) as number,
          d3.max(data, (d) => d.c) as number,
        ])
        .range([boundsHeight, 0])
    : undefined;

  const xScale = data
    ? d3
        .scaleTime()
        .domain([d3.min(data, xAccessor)!, d3.max(data, xAccessor)!])
        .range([0, boundsWidth])
    : undefined;

  // Line Path Generators
  const openingLineGenerator = data
    ? d3
        .line<Data>()
        .x((d) => xScale!(xAccessor(d)!))
        .y((d) => openingYScale!(openingYAccessor(d)))
    : undefined;

  const closingLineGenerator = data
    ? d3
        .line<Data>()
        .x((d) => xScale!(xAccessor(d)!))
        .y((d) => closingYScale!(closingYAccessor(d)))
    : undefined;

  // Axes
  const xAxis = data
    ? d3.axisBottom(xScale!).tickSizeOuter(0).tickPadding(10)
    : undefined;

  const yAxis = data
    ? d3
        .axisLeft(
          selectedLegend === 'Opening' ? openingYScale! : closingYScale!,
        )
        // eslint-disable-next-line react-hooks/rules-of-hooks -- custom hook
        .tickFormat((d) => `$${useFormatMoney(Number(d))}`)
        .tickSizeOuter(0)
        .tickPadding(10)
        .ticks(
          // eslint-disable-next-line react-hooks/rules-of-hooks -- custom hook
          useGetTicks(
            selectedLegend === 'Opening' ? openingYAccessor : closingYAccessor,
            data,
          ),
        )
    : undefined;

  const [ttInfo, setTtInfo] = useState({ time: '', open: 0, close: 0 });
  useEffect(() => {
    if (data) {
      // Create Axes
      d3.select(xAxisRef.current)
        .call(xAxis! as any)
        .style('color', '#FFF2D2')
        .style(
          'transform',
          `translate(${margin.left}px, ${height - margin.bottom}px)`,
        );

      d3.select(yAxisRef.current)
        .call(yAxis! as any)
        .style('color', '#FFF2D2')
        .style('transform', `translate(${margin.left}px, ${margin.top}px)`);

      d3.select(linePath.current)
        .transition()
        .attr(
          'd',
          selectedLegend === 'Opening'
            ? openingLineGenerator!(data)
            : (closingLineGenerator!(data) as string),
        )
        .style(
          'stroke',
          selectedLegend === 'Opening' ? openingColor : closingColor,
        );

      d3.select(xAxisRef.current)
        .call(xAxis! as any)
        .style('color', '#FFF2D2')
        .style(
          'transform',
          `translate(${margin.left}px, ${height - margin.bottom}px)`,
        );

      d3.select(yAxisRef.current)
        .call(yAxis! as any)
        .style('color', '#FFF2D2')
        .style('transform', `translate(${margin.left}px, ${margin.top}px)`);

      // Interactive Elements
      d3.select(rectRef.current).on('touchmouse mousemove', (e) => {
        const bisect = d3.bisector(xAccessor);
        const [posX, posY] = d3.pointer(e);
        const date = xScale!.invert(posX);

        const index = bisect.center(data, date);
        const d = data[index];

        const x = xScale!(xAccessor(d)!);
        const openingY = openingYScale!(openingYAccessor(d)!);
        const closingY = closingYScale!(closingYAccessor(d)!);

        // Dot on Lines
        d3.select(dotRef.current)
          .attr('cx', x)
          .attr('cy', selectedLegend === 'Opening' ? openingY : closingY);

        // Crosshair Lines
        d3.select(veritcalLineRef.current).attr(
          'd',
          `M${posX},0V${boundsHeight}`,
        );
        d3.select(horizontalLineRef.current).attr(
          'd',
          `M0,${posY}H${boundsWidth}`,
        );

        // Tooltip follow mouse
        d3.select(tooltipWrapperRef.current).style(
          'transform',
          `translate(${x > boundsWidth / 2 ? '-112px' : '1px'}, -35px)`,
        );
        d3.select(tooltipWrapperRef.current!.firstElementChild)
          .attr('x', posX)
          .attr('y', posY);

        // Update Tooltip
        const localTime = new Date(d.t).toLocaleTimeString();
        setTtInfo({
          time: localTime,
          open: d.o,
          close: d.c,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, selectedLegend]);

  return (
    <div className={styles.linechart}>
      {error ? (
        <p className={styles.linechart__error}>
          Data cannot be retrieved. Please see the{' '}
          <a
            href="https://alpaca.markets/docs/api-documentation/api-v2/market-data/cryptocurrency-historical-data/"
            target="_blank"
          >
            Alpaca API Status Page
          </a>{' '}
          for more information.
        </p>
      ) : (
        <>
          <Nav
            cryptoTitles={cryptoTitles}
            openingColor={openingColor}
            closingColor={closingColor}
            updateCrypto={updateCrypto}
            legendUpdated={legendUpdated}
            availableCrypto={cryptoTitles}
            selectedCrypto={selectedCrypto}
          />
          <svg
            className={styles.linechart__chart}
            viewBox={`0 0 ${width} ${height}`}
          >
            <rect
              ref={rectRef}
              width={boundsWidth}
              height={boundsHeight}
              fill="transparent"
              transform={`translate(${margin.left}, ${margin.top})`}
            />

            <g ref={xAxisRef} />
            <g ref={yAxisRef} />
            <path
              ref={linePath}
              fill="none"
              strokeWidth="1"
              transform={`translate(${margin.left}, ${margin.top})`}
              style={{ pointerEvents: 'none' }}
            />
            <g
              transform={`translate(${margin.left}, ${margin.top})`}
              style={{ pointerEvents: 'none' }}
            >
              <Dot
                selectLegend={selectedLegend}
                openingColor={openingColor}
                closingColor={closingColor}
                innerRef={dotRef}
              />
              <Crosshair innerRef={veritcalLineRef} />
              <Crosshair innerRef={horizontalLineRef} />
              <Tooltip
                selectedLegend={selectedLegend}
                openingColor={openingColor}
                closingColor={closingColor}
                time={ttInfo.time}
                open={ttInfo.open}
                close={ttInfo.close}
                innerRef={tooltipWrapperRef}
              />
            </g>
          </svg>
        </>
      )}
    </div>
  );
}
