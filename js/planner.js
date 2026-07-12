const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('[data-filter]');
const totalCount = document.getElementById('total-count');
const completedCount = document.getElementById('completed-count');
const remainingCount = document.getElementById('remaining-count');

const STORAGE_KEY = 'studentHubPlannerTasks';
let tasks = [];
let activeFilter = 'all';

const saveTasks = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const loadTasks = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const createTaskElement = (task) => {
  const item = document.createElement('li');
  item.className = `task-card ${task.completed ? 'completed' : ''}`;
  item.dataset.id = task.id;

  const heading = document.createElement('h3');
  heading.textContent = task.title;

  const description = document.createElement('p');
  description.textContent = `${task.course} • Due ${task.dueDate}`;

  const meta = document.createElement('div');
  meta.className = 'task-meta';
  meta.innerHTML = `
    <button type="button" class="complete-btn">${task.completed ? 'Mark Active' : 'Mark Complete'}</button>
    <button type="button" class="delete-btn">Delete</button>
  `;

  item.append(heading, description, meta);

  const completeButton = item.querySelector('.complete-btn');
  const deleteButton = item.querySelector('.delete-btn');

  completeButton.addEventListener('click', () => toggleTaskCompletion(task.id));
  deleteButton.addEventListener('click', () => removeTask(task.id));

  return item;
};

const renderTasks = () => {
  taskList.innerHTML = '';
  const visibleTasks = tasks.filter((task) => {
    if (activeFilter === 'completed') return task.completed;
    if (activeFilter === 'active') return !task.completed;
    return true;
  });

  if (visibleTasks.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'No tasks found for this filter.';
    empty.style.color = 'var(--muted)';
    taskList.appendChild(empty);
  }

  visibleTasks.forEach((task) => {
    const taskElement = createTaskElement(task);
    taskList.appendChild(taskElement);
  });

  updateSummary();
};

const updateSummary = () => {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const remaining = total - completed;

  totalCount.textContent = total;
  completedCount.textContent = completed;
  remainingCount.textContent = remaining;
};

const addTask = (event) => {
  event.preventDefault();
  const title = document.getElementById('task-title').value.trim();
  const course = document.getElementById('task-course').value.trim();
  const dueDate = document.getElementById('task-date').value;

  if (!title || !course || !dueDate) return;

  tasks.push({
    id: Date.now().toString(),
    title,
    course,
    dueDate,
    completed: false,
  });

  saveTasks();
  renderTasks();
  taskForm.reset();
};

const toggleTaskCompletion = (id) => {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
};

const removeTask = (id) => {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
};

const setFilter = (filter) => {
  activeFilter = filter;
  filterButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.filter === filter);
  });
  renderTasks();
};

const initPlanner = () => {
  tasks = loadTasks();
  taskForm?.addEventListener('submit', addTask);
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => setFilter(button.dataset.filter));
  });
  renderTasks();
};

window.addEventListener('DOMContentLoaded', initPlanner);
