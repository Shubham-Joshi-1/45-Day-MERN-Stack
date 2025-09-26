const URL = "http://localhost:3000/api/tasks";

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}


async function fetchTasks() {
  try {
    const tasksDiv = document.getElementById("tasks");
    tasksDiv.innerHTML = '<div class="loading">Loading tasks...</div>';
    const res = await fetch(URL);
    const data = await res.json();
    tasksDiv.innerHTML = "";
    if (!data.success || !data.data || data.data.length === 0) {
      tasksDiv.innerHTML =
        '<div class="no-posts">No tasks yet. Create one!</div>';
      return;
    }
    const tasks = data.data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    tasks.forEach((task) => {
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `
        <h3 class="post-title">${escapeHtml(task.title)}</h3>
        <div class="post-content">${escapeHtml(task.description)}</div>
        <p class="post-meta">
          Priority: <span class="priority-badge priority-${task.priority}">${
        task.priority
      }</span>
        </p>
        <p class="post-meta">
          Status: ${
            task.completed
              ? '<span class="completed-badge">Completed</span>'
              : "Pending"
          }
        </p>
        <p class="post-meta">📅 Created: ${new Date(
          task.createdAt
        ).toLocaleString()}</p>
        ${
          task.updatedAt && task.updatedAt !== task.createdAt
            ? `<p class="post-meta">🔄 Updated: ${new Date(
                task.updatedAt
              ).toLocaleString()}</p>`
            : ""
        }
        ${
          task.dueDate
            ? `<p class="post-meta">⏰ Due: ${new Date(
                task.dueDate
              ).toLocaleDateString()}</p>`
            : ""
        }
      `;
      tasksDiv.appendChild(div);
    });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    tasksDiv.innerHTML = '<div class="no-posts">Failed to load tasks.</div>';
  }
}

// Create task
document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const priority = document.getElementById("priority").value;
  const dueDate = document.getElementById("dueDate").value || null;

  if (!title) return;

  try {
    await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, priority, dueDate }),
    });
    document.getElementById("taskForm").reset();
    fetchTasks();
  } catch (err) {
    console.error("Error creating task:", err);
  }
});

document.addEventListener("DOMContentLoaded", fetchTasks);
