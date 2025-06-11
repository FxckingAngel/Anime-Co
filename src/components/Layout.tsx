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
          <Link href="/dashboard" legacyBehavior><a>Dashboard</a></Link>
          <Link href="/commands" legacyBehavior><a>Commands</a></Link>
          <Link href="/docs" legacyBehavior><a>Docs</a></Link>
          <Link href="/pricing" legacyBehavior><a>Pricing</a></Link>
          <Link href="/login" legacyBehavior><a className={styles.loginBtn}>Login</a></Link>
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
