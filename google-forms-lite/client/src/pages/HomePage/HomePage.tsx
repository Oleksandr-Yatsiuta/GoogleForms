import styles from './HomePage.module.scss';
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className={styles.mainPage}>

      <section className={styles.header}>
        <div className={styles.container}>
          <p>Forms</p>
          <div className={styles.inputForm}>
            <img src="https://img.icons8.com/?size=100&id=e4NkZ7kWAD7f&format=png&color=00448e" alt="Search Icon" />
            <input type="text" placeholder="Search forms..." className={styles.searchInput} />
          </div>
          <a className={styles.createFormLink}><img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Create Form" /></a>
        </div>
      </section>
      <section className={styles.content}>
        <div className={styles.makeForm}>
          <div className={styles.container}>
            <p>Make a new form</p>
            <div className={styles.formBlock}>
              <Link to="/forms/new"><img src="https://ssl.gstatic.com/docs/templates/thumbnails/forms-blank-googlecolors.png" alt="Create Form Icon" /></Link>
              <p className={styles.createFormTitle}>Blank Form</p>
            </div>

          </div>
        </div>
      </section >
    </div >
  );
}
