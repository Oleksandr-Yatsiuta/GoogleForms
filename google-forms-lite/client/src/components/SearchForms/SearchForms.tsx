import styles from './SearchForms.module.scss';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetFormsQuery } from '../../services/api';


export default function SearchForms() {
    const searchFormsRef = useRef<HTMLDivElement | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const { data: forms = [], isLoading, isError } = useGetFormsQuery();

    const filteredForms = forms.filter((form) =>
        form.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchFormsRef.current &&
                !searchFormsRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div className={styles.searchForms} ref={searchFormsRef}>
            <div className={styles.inputForm}>
                <img src="https://img.icons8.com/?size=100&id=e4NkZ7kWAD7f&format=png&color=00448e" alt="Search Icon" />
                <input
                    type="text"
                    placeholder="Search forms..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                    onFocus={() => setIsOpen(true)}
                    onClick={() => setIsOpen(true)}
                />
            </div>
            <div className={`${styles.searchArea} ${isOpen ? styles.open : ''}`}>
                {isLoading && <p className={styles.message}>Loading forms...</p>}
                {isError && <p className={styles.message}>Failed to load forms</p>}
                {!isLoading && !isError && filteredForms.length === 0 && (
                    <p className={styles.message}>No forms found</p>
                )}

                {!isLoading && !isError && filteredForms.length > 0 && (
                    <ul className={styles.searchList}>
                        {filteredForms.map((form) => (
                            <li key={form.id}>
                                <Link
                                    to={`/forms/${form.id}/fill`}
                                    className={styles.searchItem}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {form.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}