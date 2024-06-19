'use client';

import { useState } from 'react';

import type { Props } from '@/types/components/Crypto/Nav';

import styles from './index.module.scss';

export default function Nav({
  cryptoTitles,
  openingColor,
  closingColor,
  updateCrypto,
  legendUpdated,
  availableCrypto,
  selectedCrypto,
}: Props) {
  const [filterIsVisible, setFilterIsVisible] = useState(false);
  const [selectedLegend, setSelectedLegend] = useState('Opening');

  const navFilterMenuClasses = `${styles['nav__filter-menu']} ${
    filterIsVisible ? styles['nav__filter-menu--visible'] : ''
  }`;

  function legendUpdatedHandler(legend: string) {
    setSelectedLegend(legend);
    legendUpdated(legend);
  }

  function getSymbol(title: string) {
    return availableCrypto.find((item) => item.title === title)?.symbol;
  }

  function navFilterMenuItemClasses(crypto: string) {
    return `${styles['nav__filter-menu-item']} ${
      selectedCrypto === getSymbol(crypto)
        ? styles['nav__filter-menu-item--selected']
        : ''
    }`;
  }

  function getCryptoTitle(symbol: string) {
    return availableCrypto.find((crypto) => crypto.symbol === symbol)?.title;
  }

  return (
    <div className={styles.nav}>
      <h1 className={styles.nav__title}>{getCryptoTitle(selectedCrypto)}</h1>
      <div className={styles.nav__legend}>
        <div
          className={styles['nav__legend-item']}
          onClick={() => legendUpdatedHandler('Opening')}
          onKeyDown={() => legendUpdatedHandler('Opening')}
          role="button"
          tabIndex={0}
        >
          <div
            className={styles['nav__legend-color']}
            style={{
              backgroundColor:
                selectedLegend === 'Opening' ? openingColor : '#a1a1a1',
            }}
          />
          <p className={styles['nav__legend-text']}>Opening</p>
        </div>
        <div
          className={styles['nav__legend-item']}
          onClick={() => legendUpdatedHandler('Closing')}
          onKeyDown={(e) =>
            e.key === 'Enter' ? legendUpdatedHandler('Closing') : null
          }
          role="button"
          tabIndex={0}
        >
          <div
            className={styles['nav__legend-color']}
            style={{
              backgroundColor:
                selectedLegend === 'Closing' ? closingColor : '#a1a1a1',
            }}
          />
          <p className={styles['nav__legend-text']}>Closing</p>
        </div>
      </div>
      <div
        className={styles.nav__filter}
        onClick={() => setFilterIsVisible((prev: boolean) => !prev)}
        onKeyDown={(e) =>
          e.key === 'Enter'
            ? setFilterIsVisible((prev: boolean) => !prev)
            : null
        }
        onBlur={() => setFilterIsVisible(false)}
        role="button"
        tabIndex={0}
      >
        <svg
          className={styles['nav__filter-icon']}
          width="29"
          height="28"
          viewBox="0 0 29 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="button"
        >
          <rect
            x="1.37781"
            y="1"
            width="10.4444"
            height="10.4444"
            rx="4"
            stroke="#F24E29"
            strokeWidth="2"
          />
          <rect
            x="17.5556"
            y="1"
            width="10.4444"
            height="10.4444"
            rx="4"
            stroke="#F24E29"
            strokeWidth="2"
          />
          <rect
            x="1.37781"
            y="16.5555"
            width="10.4444"
            height="10.4444"
            rx="4"
            stroke="#F24E29"
            strokeWidth="2"
          />
          <rect
            x="17.5556"
            y="16.5555"
            width="10.4444"
            height="10.4444"
            rx="4"
            stroke="#F24E29"
            strokeWidth="2"
          />
        </svg>
        <div
          className={navFilterMenuClasses}
          onFocus={() => setFilterIsVisible(true)}
        >
          <p className={styles['nav__filter-menu-title']}>Filter</p>
          {cryptoTitles.map((crypto) => (
            <button
              key={crypto.symbol}
              className={navFilterMenuItemClasses(crypto.title)}
              onClick={(e) => {
                e.stopPropagation();
                updateCrypto(crypto.title);
              }}
              onKeyDown={(e) =>
                e.key === 'Enter' ? updateCrypto(crypto.title) : null
              }
              type="button"
            >
              {crypto.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
