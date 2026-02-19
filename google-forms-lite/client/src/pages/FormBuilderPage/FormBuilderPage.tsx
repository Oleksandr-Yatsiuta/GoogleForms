import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './FormBuilderPage.module.scss';
import { Form, FormQuestion, QuestionType, QuestionCardProps } from '../../features/forms/form';
import FormBuilderHeader from '../../components/FormBuiderHeader';
import { useCreateFormMutation, useGetFormQuery, useUpdateFormMutation } from '../../services/api';

export default function FormBuilderPage() {
  const { formId } = useParams<{ formId: string }>();
  const [updateForm] = useUpdateFormMutation();
  const [createForm] = useCreateFormMutation();
  const { data: existingForm, isLoading } = useGetFormQuery(formId || '', {
    skip: !formId || formId === 'new',
  });

  const [form, setForm] = useState<Form>({
    id: Date.now().toString(),
    title: 'Untitled Form',
    description: '',
    questions: [{
      id: Date.now().toString() + '-q1',
      title: 'Untitled Question',
      type: 'TEXT',
      required: false,
      options: []
    }],
  });

  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Load form data in edit mode.
  useEffect(() => {
    if (existingForm) {
      setForm(existingForm);
    }
  }, [existingForm]);

  if (isLoading) {
    return <div>Loading form...</div>;
  }

  // Update form title.
  const handleFormTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, title: e.target.value });
  };

  // Update form description.
  const handleFormDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, description: e.target.value });
  };

  // Add a new question.
  const addQuestion = () => {
    const newQuestion: FormQuestion = {
      id: Date.now().toString(),
      title: 'Untitled Question',
      type: 'TEXT',
      required: false,
    };
    setForm({ ...form, questions: [...form.questions, newQuestion] });
  };

  // Update one question by ID.
  const updateQuestion = (id: string, updates: Partial<FormQuestion>) => {
    setForm({
      ...form,
      questions: form.questions.map((q) => (q.id === id ? { ...q, ...updates } : q)),
    });
  };

  // Remove a question (keep at least one).
  const deleteQuestion = (id: string) => {
    if (form.questions.length === 1) {
      return;
    }
    setForm({
      ...form,
      questions: form.questions.filter((q) => q.id !== id),
    });
  };

  // Add option to a choice question.
  const addOption = (questionId: string) => {
    updateQuestion(questionId, {
      options: [...(form.questions.find((q) => q.id === questionId)?.options || []), 'New option'],
    });
  };

  // Update one option value.
  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = form.questions.find((q) => q.id === questionId);
    if (question?.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  // Delete one option.
  const deleteOption = (questionId: string, optionIndex: number) => {
    const question = form.questions.find((q) => q.id === questionId);
    if (question?.options) {
      const newOptions = question.options.filter((_, i) => i !== optionIndex);
      updateQuestion(questionId, { options: newOptions });
    }
  };

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
        console.log('updateForm payload', payload);
        await updateForm({ id: formId, ...payload });
      } else {
        console.log('createForm payload', payload);
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
            onChange={handleFormTitleChange}
            placeholder="Untitled Form"
          />
          <textarea
            className={styles.formDescription}
            value={form.description}
            onChange={handleFormDescriptionChange}
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

// Renders one editable question card.
function QuestionCard({
  question,
  isEditing,
  onEdit,
  onUpdate,
  onDelete,
  onAddOption,
  onUpdateOption,
  onDeleteOption,
}: QuestionCardProps) {
  return (
    <div className={`${styles.questionCard} ${isEditing ? styles.editing : ''}`}>
      <div className={styles.questionHeader}>
        <input
          type="text"
          className={styles.questionTitle}
          value={question.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          onFocus={onEdit}
          placeholder="Question text"
        />
      </div>

      {/* Question type selector */}
      <div className={styles.questionControls}>
        <select
          className={styles.typeSelector}
          value={question.type}
          onChange={(e) => onUpdate({ type: e.target.value as QuestionType })}
        >
          <option value="TEXT">Short Answer</option>
          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
          <option value="CHECKBOX">Checkbox</option>
          <option value="DATE">Date</option>
        </select>

        <label className={styles.requiredCheckbox}>
          <input
            type="checkbox"
            checked={question.required || false}
            onChange={(e) => onUpdate({ required: e.target.checked })}
          />
          Required
        </label>

        <button className={styles.deleteBtn} onClick={onDelete} title="Delete question">
          🗑️
        </button>
      </div>

      {/* Options for choice-based questions */}
      {(question.type === 'MULTIPLE_CHOICE' || question.type === 'CHECKBOX') && (
        <div className={styles.optionsContainer}>
          {question.options?.map((option, index) => (
            <div key={index} className={styles.optionInput}>
              <input
                type="text"
                value={option}
                onChange={(e) => onUpdateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
              <button
                className={styles.deleteOptionBtn}
                onClick={() => onDeleteOption(index)}
                title="Delete option"
              >
                ✕
              </button>
            </div>
          ))}
          <button className={styles.addOptionBtn} onClick={onAddOption}>
            + Add Option
          </button>
        </div>
      )}
    </div>
  );
}
