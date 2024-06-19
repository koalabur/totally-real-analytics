'use client';

import styles from './index.module.scss';
import Linechart from './Linechart';

export default function Crypto() {
  return (
    <div className={styles.crypto}>
      <Linechart />
    </div>
  );
}
