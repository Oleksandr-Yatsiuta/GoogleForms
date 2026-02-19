import { store } from '../data/store';
import type { QuestionInput, Form, Question } from '../../../types/form.types';

export class FormService {
    static createForm(title: string, description?: string, questions: QuestionInput[] = []): Form {
        const safeTitle = typeof title === 'string' && title.trim().length > 0 ? title : 'Untitled Form';

        const formQuestions: Question[] = (questions || []).map((q) => ({
            id: q.id || `q-${Math.random().toString(36).substr(2, 9)}`,
            title: typeof q.title === 'string' && q.title.trim().length > 0 ? q.title : 'Untitled Question',
            type: q.type,
            options: Array.isArray(q.options) ? q.options : [],
            required: q.required === true,
        }));

        return store.createForm(safeTitle, description, formQuestions);
    }

    static updateForm(id: string, title: string, description?: string, questions: QuestionInput[] = []): Form | null {
        const safeTitle = typeof title === 'string' && title.trim().length > 0 ? title : 'Untitled Form';

        const formQuestions: Question[] = (questions || []).map((q) => ({
            id: q.id || `q-${Math.random().toString(36).substr(2, 9)}`,
            title: typeof q.title === 'string' && q.title.trim().length > 0 ? q.title : 'Untitled Question',
            type: q.type,
            options: Array.isArray(q.options) ? q.options : [],
            required: q.required === true,
        }));

        return store.updateForm(id, safeTitle, description, formQuestions);
    }

    static getForm(id: string): Form | undefined {
        return store.getForm(id);
    }

    static getAllForms(): Form[] {
        return store.getForms();
    }
}