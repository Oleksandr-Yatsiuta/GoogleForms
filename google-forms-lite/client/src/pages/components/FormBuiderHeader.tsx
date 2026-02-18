import { Link, NavLink} from 'react-router-dom';
import styles from '../FormBuilderPage/FormBuilderPage.module.scss';

interface FormBuilderHeaderProps {
    formId: string;
    onSave: () => void;
}

export default function FormBuilderHeader({ formId, onSave }: FormBuilderHeaderProps) {
    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.leftSide}>
                    <NavLink to="/"><img src="https://cdn-icons-png.flaticon.com/512/5968/5968528.png" /></NavLink>
                    <p>New Forms</p>
                </div>

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

                <Link to={`/`}><button className={styles.saveBtn} onClick={onSave}>
                    Save
                </button></Link>
            </div>
        </header>
    );
}