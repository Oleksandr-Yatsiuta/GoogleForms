import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import FormBuilderHeader from '../components/FormBuiderHeader';
import styles from './ResponsesPage.module.scss';
import { Form, FormQuestion } from '../../features/forms/form';
import { Response } from '../../features/responses/response';

// Мок-дані
const mockForm: Form = {
  id: '1',
  title: 'Customer Feedback Form',
  description: '',
  questions: [
    {
      id: 'q1',
      title: 'What is your name?',
      type: 'TEXT',
      required: true,
    },
    {
      id: 'q2',
      title: 'How satisfied are you with our service?',
      type: 'MULTIPLE_CHOICE',
      required: true,
      options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
    },
    {
      id: 'q3',
      title: 'Which features do you like?',
      type: 'CHECKBOX',
      required: false,
      options: ['Easy to use', 'Fast', 'Reliable', 'Good support'],
    },
  ],
};

const mockResponses: Response[] = [
  {
    id: 'r1',
    formId: '1',
    answers: [
      { questionId: 'q1', value: 'John Doe' },
      { questionId: 'q2', value: 'Very Satisfied' },
      { questionId: 'q3', value: ['Easy to use', 'Reliable'] },
    ],
    submittedAt: '2025-02-15T10:30:00Z',
  },
  {
    id: 'r2',
    formId: '1',
    answers: [
      { questionId: 'q1', value: 'Jane Smith' },
      { questionId: 'q2', value: 'Satisfied' },
      { questionId: 'q3', value: ['Fast', 'Good support'] },
    ],
    submittedAt: '2025-02-16T14:45:00Z',
  },
];

const ITEMS_PER_PAGE = 1;

export default function ResponsesPage() {
  const { formId } = useParams<{ formId: string }>();
  const [currentPage, setCurrentPage] = useState(1);

  const form = mockForm;
  const responses = mockResponses.filter((r) => r.formId === form.id);
  const totalPages = Math.ceil(responses.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedResponses = responses.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const getQuestionById = (questionId: string): FormQuestion | undefined => {
    return form.questions.find((q) => q.id === questionId);
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

  return (
    <div className={styles.responsesPage}>
      <FormBuilderHeader formId={formId || ''} onSave={() => {}} />

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