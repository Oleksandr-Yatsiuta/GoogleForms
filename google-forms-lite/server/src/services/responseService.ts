import { store } from '../data/store';
import { Response, Answer } from '../types/form.types';

export class ResponseService {
  static submitResponse(formId: string, answers: Answer[]): Response | null {
    const storeAnswers: Answer[] = answers.map((a) => ({
      questionId: a.questionId,
      value: Array.isArray(a.value) ? a.value : [a.value],
    }));

    return store.submitResponse(formId, storeAnswers);
  }

  static getResponses(formId: string): Response[] {
    return store.getResponses(formId);
  }
}