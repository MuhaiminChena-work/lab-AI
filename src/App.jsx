import { useMemo, useState } from 'react';
import TodoItem from './components/TodoItem.jsx';

const priorities = [
  { value: 'low', label: 'ปกติ' },
  { value: 'medium', label: 'ปานกลาง' },
  { value: 'high', label: 'ด่วน' },
];

const filters = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'active', label: 'ยังไม่เสร็จ' },
  { value: 'completed', label: 'เสร็จแล้ว' },
];

function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function App() {
  // เก็บรายการงานไว้ใน state ของหน้าเว็บ โดยไม่เชื่อมต่อฐานข้อมูล
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  const completedCount = todos.filter((todo) => todo.completed).length;
  // คำนวณสัดส่วนจากจำนวนงานทั้งหมด และเริ่มที่ 0% เมื่อยังไม่มีงาน
  const progress = todos.length
    ? Math.round((completedCount / todos.length) * 100)
    : 0;

  const filteredTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((todo) => !todo.completed);
    if (filter === 'completed') return todos.filter((todo) => todo.completed);
    return todos;
  }, [filter, todos]);

  const filterCounts = {
    all: todos.length,
    active: todos.length - completedCount,
    completed: completedCount,
  };

  function addTodo(event) {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('กรุณากรอกชื่องานก่อนเพิ่ม');
      return;
    }

    setTodos((currentTodos) => [
      {
        id: crypto.randomUUID(),
        title: trimmedTitle,
        priority,
        dueDate,
        completed: false,
      },
      ...currentTodos,
    ]);
    setTitle('');
    setPriority('medium');
    setDueDate('');
    setError('');
  }

  function setQuickDate(offset) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    setDueDate(getLocalDateString(date));
  }

  function updateTodo(id, updates) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, ...updates } : todo,
      ),
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Smart Todo หน้าแรก">
          <span className="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="m7 12.5 3.2 3.2L18 8" />
              <path d="M20 12a8 8 0 1 1-2.34-5.66" />
            </svg>
          </span>
          <span className="brand__name">smart<span>todo</span></span>
        </a>
        <span className="topbar__caption">พื้นที่เล็ก ๆ เพื่อจัดระเบียบวันของคุณ</span>
      </header>

      <section className="dashboard" aria-labelledby="page-title">
        <div className="dashboard__heading">
          <div>
            <p className="eyebrow">ยินดีต้อนรับกลับมา</p>
            <h1 id="page-title">วันนี้ทำอะไรบ้าง?</h1>
            <p className="dashboard__subtitle">วางแผนให้ชัด แล้วค่อย ๆ ทำให้สำเร็จ</p>
          </div>
          <div
            className="progress-ring"
            role="img"
            aria-label={`ทำงานเสร็จแล้ว ${progress} เปอร์เซ็นต์`}
            style={{ '--progress': `${progress}%` }}
          >
            <div className="progress-ring__inner">
              <strong>{progress}%</strong>
              <span>เสร็จแล้ว</span>
            </div>
          </div>
        </div>

        <form className="create-card" onSubmit={addTodo}>
          <div className="create-card__title">
            <span className="section-icon" aria-hidden="true">✦</span>
            <div>
              <h2>เพิ่มงานใหม่</h2>
              <p>เริ่มต้นด้วยสิ่งที่อยากทำให้สำเร็จ</p>
            </div>
          </div>

          <label className="field-label" htmlFor="todo-title">ชื่องาน</label>
          <div className={`title-input-wrap${error ? ' title-input-wrap--error' : ''}`}>
            <input
              id="todo-title"
              className="title-input"
              type="text"
              placeholder="เช่น อ่านหนังสือ 20 นาที"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (error) setError('');
              }}
              aria-describedby={error ? 'title-error' : undefined}
              aria-invalid={Boolean(error)}
            />
            <button className="add-button" type="submit">
              <span aria-hidden="true">＋</span> เพิ่มงาน
            </button>
          </div>
          {error && <p className="form-error" id="title-error">{error}</p>}

          <div className="form-options">
            <fieldset className="priority-field">
              <legend className="field-label">ความสำคัญ</legend>
              <div className="priority-options">
                {priorities.map((item) => (
                  <button
                    key={item.value}
                    className={`priority-option priority-option--${item.value}${priority === item.value ? ' is-selected' : ''}`}
                    type="button"
                    onClick={() => setPriority(item.value)}
                    aria-pressed={priority === item.value}
                  >
                    <span className="priority-badge__dot" aria-hidden="true" />
                    {item.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="date-field">
              <label className="field-label" htmlFor="todo-date">วันที่กำหนด</label>
              <div className="date-controls">
                <input
                  id="todo-date"
                  className="date-input"
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                />
                <button type="button" className="date-shortcut" onClick={() => setQuickDate(0)}>
                  วันนี้
                </button>
                <button type="button" className="date-shortcut" onClick={() => setQuickDate(1)}>
                  พรุ่งนี้
                </button>
              </div>
            </div>
          </div>
        </form>

        <section className="todo-section" aria-labelledby="tasks-title">
          <div className="todo-section__heading">
            <div className="todo-section__title">
              <h2 id="tasks-title">รายการของฉัน</h2>
              <span className="total-count">{todos.length}</span>
            </div>
            <span className="remaining-count">
              {todos.length === 0
                ? 'เริ่มเพิ่มงานแรกของคุณได้เลย'
                : `เหลืออีก ${todos.length - completedCount} งาน`}
            </span>
          </div>

          <div className="filter-tabs" role="tablist" aria-label="กรองรายการงาน">
            {filters.map((item) => (
              <button
                key={item.value}
                className={`filter-tab${filter === item.value ? ' is-active' : ''}`}
                type="button"
                role="tab"
                aria-selected={filter === item.value}
                onClick={() => setFilter(item.value)}
              >
                {item.label}
                <span className="filter-tab__count">{filterCounts[item.value]}</span>
              </button>
            ))}
          </div>

          <div className="todo-list" aria-live="polite">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  title={todo.title}
                  priority={todo.priority}
                  dueDate={todo.dueDate}
                  completed={todo.completed}
                  onToggle={() => updateTodo(todo.id, { completed: !todo.completed })}
                  onDelete={() => setTodos((current) => current.filter((item) => item.id !== todo.id))}
                  onEdit={(newTitle) => updateTodo(todo.id, { title: newTitle })}
                />
              ))
            ) : (
              <div className="empty-state">
                <span className="empty-state__illustration" aria-hidden="true">
                  {filter === 'completed' ? '✓' : '✧'}
                </span>
                <h3>
                  {todos.length === 0
                    ? 'ยังไม่มีงานในรายการ'
                    : filter === 'completed'
                      ? 'ยังไม่มีงานที่เสร็จแล้ว'
                      : 'เยี่ยมเลย ไม่มีงานค้าง'}
                </h3>
                <p>
                  {todos.length === 0
                    ? 'เพิ่มงานแรกของคุณ แล้วมาเริ่มต้นวันดี ๆ ไปด้วยกัน'
                    : filter === 'completed'
                      ? 'ทำงานให้เสร็จ แล้วรายการจะมาแสดงที่นี่'
                      : 'คุณทำงานที่ต้องทำครบแล้ว พักสักหน่อยนะ'}
                </p>
              </div>
            )}
          </div>
        </section>
      </section>

      <footer className="footer">
        <span>ทำทีละอย่าง ก็ไปถึงเป้าหมายได้</span>
        <span className="footer__heart" aria-hidden="true">♥</span>
        <span>Smart Todo</span>
      </footer>
    </main>
  );
}
