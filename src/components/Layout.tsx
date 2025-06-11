import React, { ReactNode } from 'react';
import Head from 'next/head';
import styles from '../styles/Layout.module.css';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout = ({ children, title = 'BotGhost Pro' }: LayoutProps) => (
  <>
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Next-generation Discord bot builder. Create, manage, and deploy bots with advanced command capabilities." />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>BotGhost Pro</div>
        <nav className={styles.nav}>
          <a href="/dashboard">Dashboard</a>
          <a href="/commands">Commands</a>
          <a href="/docs">Docs</a>
          <a href="/pricing">Pricing</a>
          <a href="/login" className={styles.loginBtn}>Login</a>
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} BotGhost Pro. All rights reserved.
      </footer>
    </div>
  </>
);

export default Layout;
