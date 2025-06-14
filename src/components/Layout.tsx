import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Layout.module.css';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout = ({ children, title = 'Mellie' }: LayoutProps) => (
  <>
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Mellie: Next-generation Discord bot builder. Create, manage, and deploy bots with advanced command capabilities." />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>Mellie</div>
        <nav className={styles.nav}>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/commands">Commands</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/login" className={styles.loginBtn}>Login</Link>
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} Mellie. All rights reserved.
      </footer>
    </div>
  </>
);

export default Layout;
