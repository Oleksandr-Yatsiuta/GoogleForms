import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetFormQuery, useSubmitResponseMutation } from '../../services/api';
import styles from './FormFillPage.module.scss';

export default function FormFillPage() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { data: form, isLoading } = useGetFormQuery(formId ?? '', { skip: !formId });
  const [submitResponse] = useSubmitResponseMutation();

  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const handleInputChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId) return;

    const formattedAnswers = Object.entries(answers).map(([questionId, value]) => ({
      questionId,
      value: Array.isArray(value) ? value : [value],
    }));

    await submitResponse({ formId, answers: formattedAnswers });
    navigate(`/`);
  };

  if (isLoading) return <div className={styles.fillPage}><p>Loading form...</p></div>;
  if (!form) return <div className={styles.fillPage}><p>Form not found</p></div>;

  return (
    <div className={styles.fillPage}>
      <div className={styles.container}>
        <div className={styles.formHeader}>
          <h1>{form.title}</h1>
          {form.description && <p>{form.description}</p>}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {form.questions.map((question) => (
            <div key={question.id} className={styles.questionBlock}>
              <label className={styles.questionTitle}>
                {question.title} {question.required && <span className={styles.required}>*</span>}
              </label>

              {question.type === 'TEXT' && (
                <input
                  type="text"
                  required={question.required}
                  className={styles.textInput}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                />
              )}

              {question.type === 'MULTIPLE_CHOICE' && (
                <div className={styles.optionsContainer}>
                  {question.options?.map((option, index) => (
                    <label key={index} className={styles.option}>
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        required={question.required}
                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'CHECKBOX' && (
                <div className={styles.optionsContainer}>
                  {question.options?.map((option, index) => (
                    <label key={index} className={styles.option}>
                      <input
                        type="checkbox"
                        value={option}
                        onChange={(e) => {
                          const current = (answers[question.id] as string[]) || [];
                          const updated = e.target.checked
                            ? [...current, option]
                            : current.filter((v) => v !== option);
                          handleInputChange(question.id, updated);
                        }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'DATE' && (
                <input
                  type="date"
                  required={question.required}
                  className={styles.textInput}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                />
              )}
            </div>
          ))}

          <button type="submit" className={styles.submitBtn}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
