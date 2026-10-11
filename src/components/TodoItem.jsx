import { useEffect, useRef, useState } from 'react';

const priorityLabels = {
  low: 'ปกติ',
  medium: 'ปานกลาง',
  high: 'ด่วน',
};

function formatDueDate(value) {
  if (!value) return null;

  // แปลงวันที่แบบ local เพื่อป้องกันวันที่คลาดเคลื่อนจาก timezone
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export default function TodoItem({
  title,
  priority = 'low',
  dueDate,
  completed = false,
  onToggle,
  onDelete,
  onEdit,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  function cancelEdit() {
    setEditedTitle(title);
    setIsEditing(false);
  }

  function saveEdit() {
    const trimmedTitle = editedTitle.trim();
    if (!trimmedTitle) {
      inputRef.current?.focus();
      return;
    }

    if (trimmedTitle !== title) onEdit?.(trimmedTitle);
    setIsEditing(false);
  }

  function handleEditKeyDown(event) {
    if (event.key === 'Enter') saveEdit();
    if (event.key === 'Escape') cancelEdit();
  }

  return (
    <article className={`todo-item${completed ? ' todo-item--completed' : ''}`}>
      <button
        className={`todo-check${completed ? ' todo-check--checked' : ''}`}
        type="button"
        onClick={onToggle}
        aria-label={completed ? 'ทำเครื่องหมายว่ายังไม่เสร็จ' : 'ทำเครื่องหมายว่าเสร็จแล้ว'}
        aria-pressed={completed}
      >
        {completed && <span aria-hidden="true">✓</span>}
      </button>

      <div className="todo-item__content">
        {isEditing ? (
          <input
            ref={inputRef}
            className="todo-item__edit-input"
            value={editedTitle}
            onChange={(event) => setEditedTitle(event.target.value)}
            onKeyDown={handleEditKeyDown}
            onBlur={saveEdit}
            aria-label="แก้ไขชื่องาน"
          />
        ) : (
          <p className="todo-item__title">{title}</p>
        )}

        <div className="todo-item__meta">
          <span className={`priority-badge priority-badge--${priority}`}>
            <span className="priority-badge__dot" aria-hidden="true" />
            {priorityLabels[priority] ?? priorityLabels.low}
          </span>
          {dueDate && (
            <span className="todo-item__date">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <rect x="2.25" y="3.5" width="11.5" height="10" rx="2" />
                <path d="M5 2v3M11 2v3M2.5 6.5h11" />
              </svg>
              {formatDueDate(dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="todo-item__actions">
        {isEditing ? (
          <>
            <button
              className="icon-button icon-button--save"
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={saveEdit}
              aria-label="บันทึกชื่อ"
              title="บันทึก"
            >
              ✓
            </button>
            <button
              className="icon-button"
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={cancelEdit}
              aria-label="ยกเลิกการแก้ไข"
              title="ยกเลิก"
            >
              ×
            </button>
          </>
        ) : (
          <>
            <button
              className="icon-button"
              type="button"
              onClick={() => {
                setEditedTitle(title);
                setIsEditing(true);
              }}
              aria-label={`แก้ไข ${title}`}
              title="แก้ไข"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="m13.7 3.3 3 3M4 16l3.7-.8L16.5 6.4a2.1 2.1 0 0 0-3-3L4.7 12.2 4 16Z" />
              </svg>
            </button>
            <button
              className="icon-button icon-button--delete"
              type="button"
              onClick={onDelete}
              aria-label={`ลบ ${title}`}
              title="ลบ"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 6h12M8 6V4h4v2m2 0-.7 10H6.7L6 6m2.5 3v4m3-4v4" />
              </svg>
            </button>
          </>
        )}
      </div>
    </article>
  );
}
