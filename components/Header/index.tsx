'use client';

import Image from 'next/image';

import styles from './index.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <Image
        className={styles.logo}
        src="/logo.svg"
        alt="TOTALLY REAL analytics logo"
        width={93}
        height={32}
        priority
      />
    </header>
  );
}
