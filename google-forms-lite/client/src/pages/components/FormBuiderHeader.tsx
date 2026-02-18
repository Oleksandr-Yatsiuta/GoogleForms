import { NavLink } from 'react-router-dom';
import styles from '../FormBuilderPage/FormBuilderPage.module.scss';

interface FormBuilderHeaderProps {
  formId: string;
  onSave: () => void;
}

export default function FormBuilderHeader({ formId, onSave }: FormBuilderHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1>New form</h1>

        <div className={styles.buttonBlock}>
          <NavLink
            to="/forms/new"
            end
            className={({ isActive }) =>
              `${styles.FormBuilderBtn} ${isActive ? styles.active : ''}`
            }
          >
            Questions
          </NavLink>

          <NavLink
            to={`/forms/${formId}/responses`}
            end
            className={({ isActive }) =>
              `${styles.FormBuilderBtn} ${isActive ? styles.active : ''}`
            }
          >
            Responses
          </NavLink>
        </div>

        <button className={styles.saveBtn} onClick={onSave}>
          Save
        </button>
      </div>
    </header>
  );
}