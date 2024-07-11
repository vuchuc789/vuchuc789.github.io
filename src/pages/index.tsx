import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

const MY_BIRTHDAY = new Date('1999-08-07');

function getAge(): number {
  const today = new Date();

  let age = today.getFullYear() - MY_BIRTHDAY.getFullYear();
  const monthDiff = today.getMonth() - MY_BIRTHDAY.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < MY_BIRTHDAY.getDate())
  ) {
    age -= 1;
  }

  return age;
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <header className={styles.header}>
        <h1 className={styles.text}>Chuc&apos;s Blog</h1>
      </header>
      <main className={styles.main}>
        <div className={styles.avatarContainer}>
          <img
            src={useBaseUrl('/img/avatar.jpeg')}
            alt="Avatar"
            className={styles.avatarImage}
          />
        </div>
        <p className={`${styles.text} ${styles.description}`}>
          I&apos;m Chức. I&apos;m {getAge()}. I&apos;m currently working as a
          Site Reliability Engineer at Teko Vietnam.
          <br />
          Here is where I write stuff that I know.
        </p>
      </main>
    </Layout>
  );
}
