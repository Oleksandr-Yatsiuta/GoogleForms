import { Link, NavLink, useParams } from 'react-router-dom';
import styles from './FormBuilderHeader.module.scss';

interface FormBuilderHeaderProps {
    formId: string;
    onSave: () => void;
}

export default function FormBuilderHeader({ formId, onSave }: FormBuilderHeaderProps) {
    const { formId: routeFormId } = useParams<{ formId: string }>();
    const isEditing = Boolean(routeFormId && routeFormId !== 'new');
    
    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.leftSide}>
                    <NavLink to="/"><img src="https://cdn-icons-png.flaticon.com/512/5968/5968528.png" alt='Google-img'/></NavLink>
                    <p>{isEditing ? 'Edit Form' : 'New Form'}</p>
                </div>

                <div className={styles.buttonBlock}>
                    {isEditing ? (
                        <NavLink
                            to={`/forms/${routeFormId}/edit`}
                            end
                            className={({ isActive }) =>
                                `${styles.FormBuilderBtn} ${isActive ? styles.active : ''}`
                            }
                        >
                            Questions
                        </NavLink>
                    ) : (
                        <NavLink
                            to="/forms/new"
                            end
                            className={({ isActive }) =>
                                `${styles.FormBuilderBtn} ${isActive ? styles.active : ''}`
                            }
                        >
                            Questions
                        </NavLink>
                    )}

                    {isEditing && (
                        <NavLink
                            to={`/forms/${formId}/responses`}
                            end
                            className={({ isActive }) =>
                                `${styles.FormBuilderBtn} ${isActive ? styles.active : ''}`
                            }
                        >
                            Responses
                        </NavLink>
                    )}
                </div>

                <Link to={`/`}><button className={styles.saveBtn} onClick={onSave}>
                    Save
                </button></Link>
            </div>
        </header>
    );
}