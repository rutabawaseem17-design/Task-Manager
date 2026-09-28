import tasklyLogo from './assets/logo task.PNG'
import { useState, useEffect } from 'react'
import {
  CheckCircle2,
  Circle,
  ClipboardList,
  Plus,
  Search,
  Trash2,
  Pencil,
  CalendarDays,
  Clock3,
  LayoutDashboard,
  ListTodo,
  Check,
  CircleAlert,
  Sparkles,
  X,
} from 'lucide-react'

import './App.css'

function App() {
  // =========================
  // DEFAULT TASKS
  // =========================

  const defaultTasks = [
    {
      id: 1,
      title: 'Complete React portfolio project',
      priority: 'High',
      dueDate: '2026-09-25',
      completed: false,
    },
    {
      id: 2,
      title: 'Practice JavaScript concepts',
      priority: 'Medium',
      dueDate: '2026-09-26',
      completed: false,
    },
    {
      id: 3,
      title: 'Update portfolio website',
      priority: 'Low',
      dueDate: '2026-09-28',
      completed: true,
    },
  ]


  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('taskly-tasks')

      if (savedTasks) {
        return JSON.parse(savedTasks)
      }

      return []
    } catch {
      return []
    }
  })



  const [loading, setLoading] = useState(false)
  const [apiMessage, setApiMessage] = useState('')



  const [currentHour, setCurrentHour] = useState(
    new Date().getHours()
  )

  useEffect(() => {
    const updateTime = () => {
      setCurrentHour(new Date().getHours())
    }

    const timer = setInterval(updateTime, 60000)

    return () => clearInterval(timer)
  }, [])

  let greeting = 'Good evening!'

  if (currentHour >= 5 && currentHour < 12) {
    greeting = 'Good morning!'
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = 'Good afternoon!'
  }



  useEffect(() => {
    const savedTasks = localStorage.getItem('taskly-tasks')

    // If we already have tasks, use LocalStorage.
    // No need to call the API again.
    if (savedTasks) {
      return
    }

    const fetchTasks = async () => {
      try {
        setLoading(true)
        setApiMessage('')

        const response = await fetch(
          'https://dummyjson.com/todos?limit=10'
        )

        if (!response.ok) {
          throw new Error('Failed to fetch tasks')
        }

        const data = await response.json()

        const apiTasks = data.todos.map((task) => ({
          id: task.id,
          title: task.todo,
          priority: 'Medium',
          dueDate: '',
          completed: task.completed,
        }))

        setTasks(apiTasks)

        // Save API tasks locally
        localStorage.setItem(
          'taskly-tasks',
          JSON.stringify(apiTasks)
        )
      } catch (error) {
        console.error('API Error:', error)

        // API failed, but don't break the app.
        // Use default tasks instead.
        setTasks(defaultTasks)

        localStorage.setItem(
          'taskly-tasks',
          JSON.stringify(defaultTasks)
        )

        setApiMessage(
          'Using saved tasks because the API is temporarily unavailable.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])


  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(
        'taskly-tasks',
        JSON.stringify(tasks)
      )
    }
  }, [tasks])


  const [activePage, setActivePage] = useState('Dashboard')



  const [taskInput, setTaskInput] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [dueDate, setDueDate] = useState('')



  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')



  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')



  const addTask = () => {
    if (taskInput.trim() === '') return

    const newTask = {
      id: Date.now(),
      title: taskInput.trim(),
      priority: priority,
      dueDate: dueDate || 'No due date',
      completed: false,
    }

    setTasks((currentTasks) => [
      ...currentTasks,
      newTask,
    ])

    setTaskInput('')
    setPriority('Medium')
    setDueDate('')
  }



  const toggleTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    )
  }



  const deleteTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    )
  }



  const startEditing = (task) => {
    setEditingId(task.id)
    setEditingText(task.title)
  }

  // =========================
  // SAVE EDIT
  // =========================

  const saveEdit = (id) => {
    if (editingText.trim() === '') return

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title: editingText.trim(),
            }
          : task
      )
    )

    setEditingId(null)
    setEditingText('')
  }

  // =========================
  // CANCEL EDIT
  // =========================

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesFilter =
      filter === 'All' ||
      (filter === 'Active' && !task.completed) ||
      (filter === 'Completed' && task.completed)

    return matchesSearch && matchesFilter
  })

  // =========================
  // TASK COUNTS
  // =========================

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length

  const activeTasks = tasks.filter(
    (task) => !task.completed
  ).length

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    if (!date || date === 'No due date') {
      return 'No due date'
    }

    const options = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }

    return new Date(date).toLocaleDateString(
      'en-US',
      options
    )
  }

  // =========================
  // TASK CARD
  // =========================

  const renderTaskCard = (task) => (
    <div
      className={`task-card ${
        task.completed
          ? 'completed-task'
          : ''
      }`}
      key={task.id}
    >
      {/* CHECK */}

      <button
        className="check-button"
        onClick={() =>
          toggleTask(task.id)
        }
      >
        {task.completed ? (
          <CheckCircle2 size={25} />
        ) : (
          <Circle size={25} />
        )}
      </button>

      {/* CONTENT */}

      <div className="task-content">
        {editingId === task.id ? (
          <div className="edit-wrapper">
            <input
              className="edit-input"
              value={editingText}
              onChange={(e) =>
                setEditingText(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  saveEdit(task.id)
                }

                if (e.key === 'Escape') {
                  cancelEdit()
                }
              }}
              autoFocus
            />

            <div className="edit-buttons">
              <button
                className="save-edit"
                onClick={() =>
                  saveEdit(task.id)
                }
              >
                <Check size={16} />
                Save
              </button>

              <button
                className="cancel-edit"
                onClick={cancelEdit}
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3>
              {task.title}
            </h3>

            <div className="task-meta">
              <span
                className={`priority ${task.priority.toLowerCase()}`}
              >
                {task.priority}
              </span>

              <span className="due-date">
                <CalendarDays size={14} />

                {formatDate(
                  task.dueDate
                )}
              </span>
            </div>
          </>
        )}
      </div>

      {/* ACTIONS */}

      {editingId !== task.id && (
        <div className="task-actions">
          <button
            title="Edit"
            onClick={() =>
              startEditing(task)
            }
          >
            <Pencil size={17} />
          </button>

          <button
            title="Delete"
            onClick={() =>
              deleteTask(task.id)
            }
          >
            <Trash2 size={17} />
          </button>
        </div>
      )}
    </div>
  )

  // =========================
  // ACTIVE TASKS
  // =========================

  const activeTaskList = tasks.filter(
    (task) => !task.completed
  )

  // =========================
  // COMPLETED TASKS
  // =========================

  const completedTaskList = tasks.filter(
    (task) => task.completed
  )

  return (
    <div className="app">
      <div className="background-shape shape-one"></div>
      <div className="background-shape shape-two"></div>
      <div className="background-shape shape-three"></div>

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="sidebar">
        <div className="logo">
          <div className="logo-image">
            <img
              src={tasklyLogo}
              alt="Taskly logo"
            />
          </div>

          <div>
            <h2>Taskly</h2>
            <span>Task Manager</span>
          </div>
        </div>

        <nav className="navigation">
          <button
            className={
              activePage === 'Dashboard'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() =>
              setActivePage('Dashboard')
            }
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button
            className={
              activePage === 'My Tasks'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() =>
              setActivePage('My Tasks')
            }
          >
            <ListTodo size={19} />
            My Tasks

            <span className="nav-count">
              {activeTasks}
            </span>
          </button>

          <button
            className={
              activePage === 'Completed'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() =>
              setActivePage('Completed')
            }
          >
            <CheckCircle2 size={19} />
            Completed

            <span className="nav-count">
              {completedTasks}
            </span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <Sparkles size={20} />

          <div>
            <strong>Stay productive</strong>
            <p>Small steps every day.</p>
          </div>
        </div>
      </aside>

      {/* =========================
          MAIN
      ========================= */}

      <main className="main">

        {/* =========================
            DASHBOARD
        ========================= */}

        {activePage === 'Dashboard' && (
          <>
            {/* HEADER */}

            <header className="top-header">
              <div>
                <p className="greeting">
                  Welcome  
                </p>

                <h1>{greeting}</h1>

                <p className="subtitle">
                  Here's what's happening with your tasks today.
                </p>
              </div>

              <div className="date-box">
                <CalendarDays size={18} />

                <span>
                 {new Date().getMonth() + 1} , {new Date().getDate()} , {new Date().getFullYear()}
                </span>
              </div>
            </header>

            {/* API LOADING */}

            {loading && (
              <div className="empty-state">
                <ClipboardList size={35} />

                <h3>Loading tasks...</h3>

                <p>
                  Fetching your tasks from the API.
                </p>
              </div>
            )}

            {/* API MESSAGE */}

            {apiMessage && !loading && (
              <div className="empty-state">
                <CircleAlert size={25} />

                <p>{apiMessage}</p>
              </div>
            )}

            {/* STATS */}

            {!loading && (
              <>
                <section className="stats">
                  <div className="stat-card">
                    <div className="stat-icon purple">
                      <ClipboardList size={22} />
                    </div>

                    <div>
                      <span>Total Tasks</span>
                      <strong>{tasks.length}</strong>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon blue">
                      <Clock3 size={22} />
                    </div>

                    <div>
                      <span>Active Tasks</span>
                      <strong>{activeTasks}</strong>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon green">
                      <Check size={22} />
                    </div>

                    <div>
                      <span>Completed</span>
                      <strong>{completedTasks}</strong>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon orange">
                      <CircleAlert size={22} />
                    </div>

                    <div>
                      <span>Pending</span>
                      <strong>{activeTasks}</strong>
                    </div>
                  </div>
                </section>

                {/* ADD TASK */}

                <section className="add-task-card">
                  <div className="section-heading">
                    <div>
                      <h2>Create a new task</h2>

                      <p>
                        What would you like to accomplish?
                      </p>
                    </div>
                  </div>

                  <div className="add-task-form">
                    <div className="input-wrapper">
                      <Plus size={20} />

                      <input
                        type="text"
                        placeholder="Enter your task..."
                        value={taskInput}
                        onChange={(e) =>
                          setTaskInput(e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addTask()
                          }
                        }}
                      />
                    </div>

                    <select
                      className="task-select"
                      value={priority}
                      onChange={(e) =>
                        setPriority(e.target.value)
                      }
                    >
                      <option value="Low">
                        Low Priority
                      </option>

                      <option value="Medium">
                        Medium Priority
                      </option>

                      <option value="High">
                        High Priority
                      </option>
                    </select>

                    <div className="date-input">
                      <CalendarDays size={17} />

                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) =>
                          setDueDate(e.target.value)
                        }
                      />
                    </div>

                    <button
                      className="add-button"
                      onClick={addTask}
                    >
                      <Plus size={19} />
                      Add Task
                    </button>
                  </div>
                </section>

                {/* TASKS */}

                <section className="tasks-section">
                  <div className="tasks-header">
                    <div>
                      <h2>My Tasks</h2>

                      <p>
                        Keep track of everything you need to do.
                      </p>
                    </div>

                    <div className="search-box">
                      <Search size={18} />

                      <input
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) =>
                          setSearch(e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* FILTERS */}

                  <div className="filter-bar">
                    {[
                      'All',
                      'Active',
                      'Completed',
                    ].map((item) => (
                      <button
                        key={item}
                        className={
                          filter === item
                            ? 'filter active-filter'
                            : 'filter'
                        }
                        onClick={() =>
                          setFilter(item)
                        }
                      >
                        {item}

                        <span>
                          {item === 'All'
                            ? tasks.length
                            : item === 'Active'
                            ? activeTasks
                            : completedTasks}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* TASK LIST */}

                  <div className="task-list">
                    {filteredTasks.length === 0 ? (
                      <div className="empty-state">
                        <ClipboardList size={45} />

                        <h3>
                          No tasks found
                        </h3>

                        <p>
                          Add a new task to get started.
                        </p>
                      </div>
                    ) : (
                      filteredTasks.map(
                        renderTaskCard
                      )
                    )}
                  </div>
                </section>
              </>
            )}
          </>
        )}

        {/* =========================
            MY TASKS
        ========================= */}

        {activePage === 'My Tasks' && (
          <section className="tasks-page">
            <div className="page-header">
              <div>
                <p className="greeting">
                  Task management 📋
                </p>

                <h1>My Tasks</h1>

                <p className="subtitle">
                  Here are all your active tasks.
                </p>
              </div>

              <div className="page-count">
                <ListTodo size={20} />

                <span>
                  {activeTasks} active
                </span>
              </div>
            </div>

            <div className="task-list">
              {activeTaskList.length === 0 ? (
                <div className="empty-state">
                  <CheckCircle2 size={45} />

                  <h3>
                    All caught up! 
                  </h3>

                  <p>
                    You don't have any active tasks.
                  </p>
                </div>
              ) : (
                activeTaskList.map(
                  renderTaskCard
                )
              )}
            </div>
          </section>
        )}

        {/* =========================
            COMPLETED
        ========================= */}

        {activePage === 'Completed' && (
          <section className="tasks-page">
            <div className="page-header">
              <div>
                <p className="greeting">
                  Nice work! 
                </p>

                <h1>Completed Tasks</h1>

                <p className="subtitle">
                  Here's everything you've completed.
                </p>
              </div>

              <div className="page-count completed-count">
                <CheckCircle2 size={20} />

                <span>
                  {completedTasks} completed
                </span>
              </div>
            </div>

            <div className="task-list">
              {completedTaskList.length === 0 ? (
                <div className="empty-state">
                  <ClipboardList size={45} />

                  <h3>
                    No completed tasks yet
                  </h3>

                  <p>
                    Complete a task and it will appear here.
                  </p>
                </div>
              ) : (
                completedTaskList.map(
                  renderTaskCard
                )
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App 