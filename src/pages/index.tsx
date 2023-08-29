import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import LogoTrust from '@site/static/img/logo-trust.svg';
import Slogan from '@site/static/img/slogan.svg';

import styles from './index.module.css';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <LogoTrust className={styles.logoTrust} />
      <main className={styles.main}>
        <Slogan className={styles.slogan} />
      </main>
    </Layout>
  );
}
