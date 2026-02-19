import styles from './HomePage.module.scss';
import { Link } from "react-router-dom";
import { useGetFormsQuery } from '../../services/api';


export default function HomePage() {
   // Fetch all forms with automatic caching
  const { data: forms = [], isLoading } = useGetFormsQuery();

  return (
    <div className={styles.mainPage}>
      <section className={styles.header}>
        <div className={styles.container}>
          <div className={styles.leftSide}>
            <img src="https://cdn-icons-png.flaticon.com/512/5968/5968528.png" alt="Forms icon" />
            <p>Forms</p>
          </div>
          <div className={styles.inputForm}>
            <img src="https://img.icons8.com/?size=100&id=e4NkZ7kWAD7f&format=png&color=00448e" alt="Search Icon" />
            <input type="text" placeholder="Search forms..." className={styles.searchInput} />
          </div>
          <Link to="/" className={styles.createFormLink}>
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="User profile" />
          </Link>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.makeForm}>
          <div className={styles.container}>
            <p>Make a new form</p>
            <div className={styles.formsGrid}>
              <div className={styles.formBlock}>
                <Link to="/forms/new">
                  <img src="https://ssl.gstatic.com/docs/templates/thumbnails/forms-blank-googlecolors.png" alt="Create Form" />
                </Link>
                <p className={styles.createFormTitle}>Blank Form</p>
              </div>
              
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <>
                  {forms.map((form) => (
                    <div key={form.id} className={styles.formBlock}>
                      <Link to={`/forms/${form.id}/edit`}>
                        <img src="https://static0.anpoimages.com/wordpress/wp-content/uploads/2024/05/google-forms-short-response-template.jpg?q=70&fit=crop&w=825&dpr=1" alt="Form preview" />
                      </Link>
                      <p className={styles.createFormTitle}>{form.title}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.FillBlock}>
        <div className={styles.container}>
          <p>Recent forms for filling</p>
          {isLoading ? (
            <p>Loading forms...</p>
          ) : (
            <div className={styles.formsGrid}>
              {forms.map((form) => (
                <Link key={form.id} to={`/forms/${form.id}/fill`} className={styles.recentForms}>
                  <img src="https://static0.anpoimages.com/wordpress/wp-content/uploads/2024/05/google-forms-short-response-template.jpg?q=70&fit=crop&w=825&dpr=1" alt="Form preview" />
                  <p>{form.title}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
