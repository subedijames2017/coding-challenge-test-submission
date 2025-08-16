import styles from './Loader.module.css';

export default function Loader({ text = "Loading..." }) {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.spinner}></div>
      {text && <p className={styles.loaderText}>{text}</p>}
    </div>
  );
}
