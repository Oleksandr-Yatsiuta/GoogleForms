import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import FormBuilderHeader from '../../components/FormBuilderHeader/FormBuilderHeader';
import styles from './ResponsesPage.module.scss';
import type { FormQuestion } from '../../../../types/form.types';
import { useGetFormQuery, useGetResponsesQuery } from '../../services/api';
import { formatDate, formatAnswer } from '../../utils/formatters';

const ITEMS_PER_PAGE = 1;


export default function ResponsesPage() {
  const { formId } = useParams<{ formId: string }>();
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch form data
  const {
    data: form,
    isLoading: isFormLoading,
    isError: isFormError,
  } = useGetFormQuery(formId ?? '', { skip: !formId });


// Fetch responses for this form
  const {
    data: responses = [],
    isLoading: isResponsesLoading,
    isError: isResponsesError,
  } = useGetResponsesQuery(formId ?? '', { skip: !formId });


  // Pagination logic
  const totalPages = Math.ceil(responses.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedResponses = responses.slice(startIdx, startIdx + ITEMS_PER_PAGE);


  // Get question details by ID
  const getQuestionById = (questionId: string): FormQuestion | undefined => {
    return form?.questions.find((q) => q.id === questionId);
  };

// Handle missing form ID
  if (!formId) {
    return (
      <div className={styles.responsesPage}>
        <FormBuilderHeader formId="" onSave={() => {}} />
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <p>Form ID is missing</p>
          </div>
        </div>
      </div>
    );
  }

   // Loading state
  if (isFormLoading || isResponsesLoading) {
    return (
      <div className={styles.responsesPage}>
        <FormBuilderHeader formId={formId} onSave={() => {}} />
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <p>Loading responses...</p>
          </div>
        </div>
      </div>
    );
  }


  // Error state
  if (isFormError || isResponsesError || !form) {
    return (
      <div className={styles.responsesPage}>
        <FormBuilderHeader formId={formId} onSave={() => {}} />
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <p>Failed to load form or responses</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.responsesPage}>
      <FormBuilderHeader formId={formId} onSave={() => {}} />

      <div className={styles.container}>
        <section className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <h1>{form.title}</h1>
            </div>
            <button className={styles.moreBtn}>⋮</button>
          </div>
        </section>

        <section className={styles.responsesHeader}>
          <div className={styles.headerInfo}>
            <p className={styles.responseCount}>{responses.length} response</p>
          </div>
        </section>

        {paginatedResponses.length > 0 ? (
          paginatedResponses.map((response, index) => (
            <div key={response.id} className={styles.responseCard}>
              <div className={styles.cardHeader}>
                <h3>Response #{startIdx + index + 1}</h3>
                <div className={styles.cardMeta}>
                  <span className={styles.timestamp}>
                    {formatDate(response.submittedAt)}
                  </span>
                  <button className={styles.moreBtn}>⋮</button>
                </div>
              </div>

              <div className={styles.answers}>
                {response.answers.map((answer) => {
                  const question = getQuestionById(answer.questionId);
                  return (
                    <div key={answer.questionId} className={styles.answerItem}>
                      <div className={styles.questionInfo}>
                        <p className={styles.questionText}>{question?.title}</p>
                        <p className={styles.answerText}>{formatAnswer(answer.value)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No responses yet</p>
          </div>
        )}

        {responses.length > 0 && (
          <div className={styles.pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={styles.paginationBtn}
            >
              ←
            </button>
            <span className={styles.pageInfo}>
              {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={styles.paginationBtn}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}