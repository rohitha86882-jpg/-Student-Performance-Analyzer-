const form = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const subjectInput = document.getElementById('subject');
const dueDateInput = document.getElementById('dueDate');
const taskList = document.getElementById('taskList');
const filterInput = document.getElementById('filter');

let tasks = JSON.parse(localStorage.getItem('studentPlannerTasks') || '[]');

document.getElementById('today').textContent = new Date().toLocaleDateString(undefined, {
  weekday: 'long', month: 'long', day: 'numeric'
});

function saveTasks() {
  localStorage.setItem('studentPlannerTasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  const filter = filterInput.value;
  const visibleTasks = tasks.filter(task =>
    filter === 'all' || (filter === 'completed' ? task.completed : !task.completed)
  );

  visibleTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task ${task.completed ? 'done' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', 'Mark task complete');
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const info = document.createElement('div');
    info.className = 'task-info';
    const name = document.createElement('span');
    name.className = 'task-name';
    name.textContent = task.title;
    const meta = document.createElement('span');
    meta.className = 'task-meta';
    meta.textContent = `${task.subject} · ${task.dueDate ? 'Due ' + task.dueDate : 'No due date'}`;
    info.append(name, meta);

    const remove = document.createElement('button');
    remove.className = 'delete';
    remove.textContent = 'Delete';
    remove.addEventListener('click', () => {
      tasks = tasks.filter(item => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    li.append(checkbox, info, remove);
    taskList.appendChild(li);
  });

  document.getElementById('empty').hidden = visibleTasks.length > 0;
  document.getElementById('total').textContent = tasks.length;
  document.getElementById('completed').textContent = tasks.filter(t => t.completed).length;
  document.getElementById('pending').textContent = tasks.filter(t => !t.completed).length;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  tasks.unshift({
    id: Date.now(),
    title,
    subject: subjectInput.value,
    dueDate: dueDateInput.value,
    completed: false
  });

  saveTasks();
  form.reset();
  renderTasks();
  taskInput.focus();
});

filterInput.addEventListener('change', renderTasks);
renderTasks();
