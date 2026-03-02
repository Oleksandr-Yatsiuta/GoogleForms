import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './FormBuilderPage.module.scss';
import FormBuilderHeader from '../../components/FormBuilderHeader/FormBuilderHeader';
import QuestionCard from '../../components/QuestionCard/QuestionCard';
import { useCreateFormMutation, useGetFormQuery, useUpdateFormMutation } from '../../services/api';
import { useFormBuilder } from './hooks/useFormBuilder';

export default function FormBuilderPage() {
  const { formId } = useParams<{ formId: string }>();
  const [updateForm] = useUpdateFormMutation();
  const [createForm] = useCreateFormMutation();
  const { data: existingForm, isLoading } = useGetFormQuery(formId || '', {
    skip: !formId || formId === 'new',
  });

  const {
    form,
    editingQuestionId,
    setEditingQuestionId,
    setFormFromExisting,
    handleFormTitleChange,
    handleFormDescriptionChange,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addOption,
    updateOption,
    deleteOption,
  } = useFormBuilder();

  // Load form data in edit mode.
  useEffect(() => {
    if (existingForm) {
      setFormFromExisting(existingForm);
    }
  }, [existingForm, setFormFromExisting]);

  if (isLoading) {
    return <div>Loading form...</div>;
  }

  // Save form (create or update).
  const handleSaveForm = async () => {
    try {
      const payload = {
        title: form.title,
        description: form.description,
        questions: form.questions.map((q) => ({
          title: q.title,
          type: q.type,
          required: q.required ?? false,
          options: q.options ?? [],
        })),
      };

      if (formId && formId !== 'new') {
        await updateForm({ id: formId, ...payload });
      } else {
        await createForm(payload);
      }
    } catch (error) {
      console.error('Save form failed:', error);
    }
  };

  return (
    <div className={styles.formBuilder}>
      <FormBuilderHeader formId={form.id} onSave={handleSaveForm} />

      <div className={styles.container}>
        <section className={styles.formInfo}>
          <input
            type="text"
            className={styles.formTitle}
            value={form.title}
            onChange={(event) => handleFormTitleChange(event.target.value)}
            placeholder="Untitled Form"
          />
          <textarea
            className={styles.formDescription}
            value={form.description}
            onChange={(event) => handleFormDescriptionChange(event.target.value)}
            placeholder="Form description"
          />
        </section>

        <section className={styles.questionsContainer}>
          <div className={styles.questionsBlock}>
            {form.questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                isEditing={editingQuestionId === question.id}
                onEdit={() => setEditingQuestionId(question.id)}
                onUpdate={(updates) => updateQuestion(question.id, updates)}
                onDelete={() => deleteQuestion(question.id)}
                onAddOption={() => addOption(question.id)}
                onUpdateOption={(optionIndex, value) =>
                  updateOption(question.id, optionIndex, value)
                }
                onDeleteOption={(optionIndex) => deleteOption(question.id, optionIndex)}
              />
            ))}

            <div className={styles.addQuestionSection}>
              <button className={styles.addQuestionBtn} onClick={addQuestion}>
                + Add Question
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
