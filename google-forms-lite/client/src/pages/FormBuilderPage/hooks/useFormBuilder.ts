import { useCallback, useState } from 'react';
import type { Form, FormQuestion } from '../../../../../types/form.types';
import { generateId } from '../../../utils/generateId';

const createInitialForm = (): Form => ({
  id: generateId('form'),
  title: 'Untitled Form',
  description: '',
  questions: [
    {
      id: generateId('question'),
      title: 'Untitled Question',
      type: 'TEXT',
      required: false,
      options: [],
    },
  ],
});

export function useFormBuilder() {
  const [form, setForm] = useState<Form>(createInitialForm);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Load form data in edit mode.
  const setFormFromExisting = useCallback((existingForm: Form) => {
    setForm(existingForm);
  }, []);

  // Update form title.
  const handleFormTitleChange = (title: string) => {
    setForm((prev) => ({ ...prev, title }));
  };

  // Update form description.
  const handleFormDescriptionChange = (description: string) => {
    setForm((prev) => ({ ...prev, description }));
  };

  // Add a new question.
  const addQuestion = () => {
    const newQuestion: FormQuestion = {
      id: generateId('question'),
      title: 'Untitled Question',
      type: 'TEXT',
      required: false,
      options: [],
    };

    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  // Update one question by ID.
  const updateQuestion = (id: string, updates: Partial<FormQuestion>) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((question) =>
        question.id === id ? { ...question, ...updates } : question
      ),
    }));
  };

  // Remove a question (keep at least one).
  const deleteQuestion = (id: string) => {
    setForm((prev) => {
      if (prev.questions.length === 1) {
        return prev;
      }

      return {
        ...prev,
        questions: prev.questions.filter((question) => question.id !== id),
      };
    });
  };

  // Add option to a choice question.
  const addOption = (questionId: string) => {
    const options = form.questions.find((question) => question.id === questionId)?.options || [];
    updateQuestion(questionId, {
      options: [...options, 'New option'],
    });
  };

  // Update one option value.
  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = form.questions.find((item) => item.id === questionId);
    if (!question?.options) {
      return;
    }

    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    updateQuestion(questionId, { options: newOptions });
  };

  // Delete one option.
  const deleteOption = (questionId: string, optionIndex: number) => {
    const question = form.questions.find((item) => item.id === questionId);
    if (!question?.options) {
      return;
    }

    const newOptions = question.options.filter((_, index) => index !== optionIndex);
    updateQuestion(questionId, { options: newOptions });
  };

  return {
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
  };
}