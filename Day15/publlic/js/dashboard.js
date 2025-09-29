// Dashboard state
let tasks = [];
let teams = [];
const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// On page load
document.addEventListener("DOMContentLoaded", async () => {
  await fetchUserInfo();
  await fetchTasks();
  await fetchTeams();
});

// Fetch user info
async function fetchUserInfo() {
  try {
    const res = await fetch("http://localhost:3000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const user = await res.json();
    document.getElementById("user-info").innerHTML = `<p>Logged in as <strong>${escapeHtml(user.name)}</strong></p>`;
  } catch (err) {
    console.error(err);
  }
}

// Fetch tasks
async function fetchTasks() {
  try {
    const res = await fetch("http://localhost:3000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    tasks = data.data || [];
    renderTasks();
    renderStats();
  } catch (err) {
    console.error(err);
  }
}

// Fetch teams
async function fetchTeams() {
  try {
    const res = await fetch("http://localhost:3000/api/teams", {
      headers: { Authorization: `Bearer ${token}` }
    });
    teams = (await res.json()).data || [];
    renderTeams();
  } catch (err) {
    console.error(err);
  }
}

// Render tasks
function renderTasks() {
  const container = document.getElementById("my-tasks");
  if (tasks.length === 0) {
    container.innerHTML = "<p>No tasks assigned yet.</p>";
    return;
  }
  container.innerHTML = "";
  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task-card";
    div.innerHTML = `
      <h3>${escapeHtml(task.title)}</h3>
      <p>${escapeHtml(task.description)}</p>
      <small>Priority: ${task.priority} | Status: ${task.status}</small>
      <div class="actions">
        <button onclick="editTask('${task.id}')">✏️ Edit</button>
        <button onclick="deleteTask('${task.id}')">🗑️ Delete</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// Render stats cards
function renderStats() {
  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === "done").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    pending: tasks.filter(t => t.status === "todo").length
  };
  const container = document.getElementById("stats-cards");
  container.innerHTML = `
    <div class="card">Total Tasks: ${stats.total}</div>
    <div class="card">Done: ${stats.done}</div>
    <div class="card">In Progress: ${stats.inProgress}</div>
    <div class="card">Pending: ${stats.pending}</div>
  `;
}

// Render team overview
function renderTeams() {
  const container = document.getElementById("team-overview");
  if (teams.length === 0) {
    container.innerHTML = "<p>No teams available.</p>";
    return;
  }
  container.innerHTML = "";
  teams.forEach(team => {
    const div = document.createElement("div");
    div.className = "team-card";
    div.innerHTML = `<h3>${escapeHtml(team.name)}</h3><p>${escapeHtml(team.description)}</p><small>Members: ${team.members.length}</small>`;
    container.appendChild(div);
  });
}

// Add new task
document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDescription").value.trim();
  const priority = document.getElementById("taskPriority").value;
  const dueDate = document.getElementById("taskDueDate").value;

  try {
    const res = await fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, description, priority, dueDate })
    });
    await fetchTasks();
    e.target.reset();
  } catch (err) {
    console.error(err);
  }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

// Edit / Delete functions placeholders
window.editTask = (id) => { alert("Edit task " + id); };
window.deleteTask = (id) => { alert("Delete task " + id); };
