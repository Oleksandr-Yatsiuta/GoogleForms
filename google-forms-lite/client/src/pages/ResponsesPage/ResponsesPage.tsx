import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import FormBuilderHeader from '../components/FormBuiderHeader';
import styles from './ResponsesPage.module.scss';
import { FormQuestion } from '../../features/forms/form';
import { useGetFormQuery, useGetResponsesQuery } from '../../services/api';

const ITEMS_PER_PAGE = 1;

export default function ResponsesPage() {
  const { formId } = useParams<{ formId: string }>();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: form,
    isLoading: isFormLoading,
    isError: isFormError,
  } = useGetFormQuery(formId ?? '', { skip: !formId });

  const {
    data: responses = [],
    isLoading: isResponsesLoading,
    isError: isResponsesError,
  } = useGetResponsesQuery(formId ?? '', { skip: !formId });

  const totalPages = Math.ceil(responses.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedResponses = responses.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const getQuestionById = (questionId: string): FormQuestion | undefined => {
    return form?.questions.find((q) => q.id === questionId);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAnswer = (value: string | string[] | boolean) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value;
  };

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