import styles from './QuestionCard.module.scss';
import type { QuestionType, QuestionCardProps } from '../../../../types/form.types';

export default function QuestionCard({
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