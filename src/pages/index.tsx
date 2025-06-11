import Layout from '@/components/Layout';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';

export default function Home() {
  return (
    <Layout>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Next-Gen Discord Bot Builder
          </h1>
          <p className={styles.subtitle}>
            Create, manage, and deploy powerful Discord bots with every command possible. No coding required. Production-ready, secure, and lightning fast.
          </p>
          <div className={styles.ctaGroup}>
            <a href="/signup" className={styles.ctaPrimary}>Get Started Free</a>
            <a href="/docs" className={styles.ctaSecondary}>Read Docs</a>
          </div>
        </div>
        <div className={styles.heroImage}>
          <Image src="/dashboard-preview.png" alt="BotGhost Pro Dashboard" width={540} height={340} priority />
        </div>
      </section>

      <section className={styles.features}>
        <h2>Why BotGhost Pro?</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3>Visual Command Builder</h3>
            <p>Design complex bot commands with a drag-and-drop interface. Every Discord command and event supported, no code required.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Real-Time Dashboard</h3>
            <p>Monitor your bots, view logs, and manage servers in real time with a Google-level, high-performance dashboard.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Production-Ready Security</h3>
            <p>Enterprise-grade authentication, rate limiting, and audit logs. Your bots and data are always protected.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Instant Deployment</h3>
            <p>Deploy bots to Discord with a single click. Zero downtime, auto-scaling, and global infrastructure.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Extensive Integrations</h3>
            <p>Connect to databases, webhooks, APIs, and more. Build bots that do everything you can imagine.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Open Command Library</h3>
            <p>Access a library of pre-built commands and templates. Share and import with the community.</p>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2>Ready to build your next Discord bot?</h2>
        <a href="/signup" className={styles.ctaPrimaryLarge}>Start for Free</a>
      </section>
    </Layout>
  );
}
