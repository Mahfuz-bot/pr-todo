import { v4 as uuidv4 } from 'uuid';

type Task = {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: number;
};

const form = document.querySelector('#form') as HTMLFormElement;
const input = document.querySelector('#inputForm') as HTMLInputElement;
const taskPriority = document.querySelector('#task-priority') as HTMLSelectElement;
const list = document.querySelector('#todoList') as HTMLUListElement;
const filterButtons = document.querySelectorAll<HTMLButtonElement>('.filters button');
const searchInput = document.querySelector('#search') as HTMLInputElement

let tasks: Task[] = loadTask();
let currentFilter: 'all' | 'completed' | 'pending' = 'all';
let searchTerm: string = ''

renderTasks();

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!input.value.trim()) return;

  const newTask: Task = {
    id: uuidv4(),
    title: input.value.trim(),
    completed: false,
    priority: taskPriority.value as 'low' | 'medium' | 'high',
    createdAt: Date.now()
  };

  tasks.push(newTask);
  saveTask(tasks);
  renderTasks();
  input.value = '';
});
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter as 'all' | 'completed' | 'pending';
    renderTasks();
  });
});

searchInput?.addEventListener('input', () => {
  searchTerm = searchInput.value.toLowerCase();
  renderTasks();
});

function renderTasks() {
  list.innerHTML = '';
  let filteredTasks = tasks;

  if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (currentFilter === 'pending') {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  if (searchTerm) {
    filteredTasks = filteredTasks.filter(task => task.title.toLowerCase().includes(searchTerm))
  }

  filteredTasks.forEach(addTask);
}

function addTask(task: Task) {
  const { id, title, completed, priority, createdAt } = task;

  const label = document.createElement('label');
  const item = document.createElement('li');
  const span = document.createElement('span');
  const checkbox = document.createElement('input');
  const button = document.createElement('button');

  checkbox.type = 'checkbox';
  checkbox.checked = completed;
  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    saveTask(tasks);
    renderTasks();
  });

  button.type = 'button';
  button.textContent = 'Delete';
  button.disabled = !checkbox.checked;
  button.addEventListener('click', () => {
    tasks = tasks.filter(existedTask => existedTask.id !== id);
    saveTask(tasks);
    renderTasks();
  });

  span.textContent = `${priority.toLocaleUpperCase()} | ${formatDate(createdAt)}`;
  label.append(checkbox, title);
  item.append(label, span, button);
  list.appendChild(item);
}

function saveTask(tasks: Task[]) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTask(): Task[] {
  const taskJSON = localStorage.getItem('tasks');
  return taskJSON ? JSON.parse(taskJSON) : [];
}

function formatDate(value: number) {
  return new Date(value).toLocaleString('en-us', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
