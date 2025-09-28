const URL = "http://localhost:3000/api/posts";
let editingPostId = null;

function showMessage(message, type = "success") {
  const messageDiv = document.createElement("div");
  messageDiv.className = type;
  messageDiv.textContent = message;

  const container = document.querySelector(".container");
  container.insertBefore(messageDiv, container.firstChild);

  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

// GET
async function fetchPosts() {
  try {
    const postsDiv = document.getElementById("posts");
    postsDiv.innerHTML = '<div class="loading">Loading posts...</div>';

    const res = await fetch(URL);
    const data = await res.json();

    postsDiv.innerHTML = "";

    if (!data.success || !data.data || data.data.length === 0) {
      postsDiv.innerHTML =
        '<div class="no-posts">No posts found. Create your first post!</div>';
      return;
    }

    const posts = data.data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    posts.forEach((post) => {
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `
        <h3 class="post-title">${escapeHtml(post.title)}</h3>
        <div class="post-content">${escapeHtml(post.content)}</div>
        
        <div class="post-meta">
          <p class="post-author"><strong>👤 Author :</strong> ${escapeHtml(post.author)}</p>
          <div class="tags">
            <strong>Tags:</strong> 
            ${
              post.tags?.length
                ? post.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")
                : '<span style="color: #a0aec0; font-style: italic;">No tags</span>'
            }
          </div>
          <p>
            <strong>Status:</strong> 
            <span class="status-badge ${post.published ? "status-published" : "status-draft"}">
              ${post.published ? "Published" : "Draft"}
            </span>
          </p>
          <p><strong>📅 Created:</strong> ${new Date(post.createdAt).toLocaleString()}</p>
          ${
            post.updatedAt && post.updatedAt !== post.createdAt
              ? `<p><strong>🔄 Updated:</strong> ${new Date(post.updatedAt).toLocaleString()}</p>`
              : ""
          }
        </div>
        
        <div class="actions">
          <button class="btn-edit" onclick="editPost('${post._id}')">✏️ Edit</button>
          <button class="btn-delete" onclick="deletePost('${post._id}', '${escapeHtml(post.title)}')">🗑️ Delete</button>
        </div>
      `;
      postsDiv.appendChild(div);
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    document.getElementById("posts").innerHTML =
      '<div class="error">Failed to load posts. Please check if the server is running.</div>';
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// POST & PUT
document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const author = document.getElementById("author").value.trim();
  const tags = document.getElementById("tags").value.split(",").map((t) => t.trim()).filter((t) => t);
  const published = document.getElementById("published").checked;
  const editPostId = document.getElementById("editPostId").value;

  if (!title || !content || !author) {
    showMessage("Please fill in all required fields.", "error");
    return;
  }

  const postData = { title, content, author, tags, published };

  try {
    let response;
    if (editPostId) {
      response = await fetch(`${URL}/${editPostId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
    } else {
      response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
    }

    const result = await response.json();

    if (result.success) {
      showMessage(editPostId ? "Post updated successfully!" : "Post created successfully!");
      resetForm();
      fetchPosts();
    } else {
      showMessage(result.error || "Failed to save post", "error");
    }
  } catch (error) {
    console.error("Error saving post:", error);
    showMessage("Failed to save post. Please check your connection.", "error");
  }
});

async function editPost(id) {
  try {
    const response = await fetch(`${URL}/${id}`);
    const result = await response.json();

    if (result.success && result.data) {
      const post = result.data;

      document.getElementById("editPostId").value = id;
      document.getElementById("title").value = post.title;
      document.getElementById("content").value = post.content;
      document.getElementById("author").value = post.author;
      document.getElementById("tags").value = post.tags ? post.tags.join(", ") : "";
      document.getElementById("published").checked = post.published;

      document.getElementById("formTitle").textContent = "Edit Post";
      document.getElementById("submitBtn").textContent = "Update Post";
      document.getElementById("cancelBtn").style.display = "inline-block";

      document.querySelector(".form-container").scrollIntoView({ behavior: "smooth" });
      editingPostId = id;
    } else {
      showMessage("Failed to load post for editing", "error");
    }
  } catch (error) {
    console.error("Error loading post for edit:", error);
    showMessage("Failed to load post for editing", "error");
  }
}

document.getElementById("cancelBtn").addEventListener("click", resetForm);

function resetForm() {
  document.getElementById("postForm").reset();
  document.getElementById("editPostId").value = "";
  document.getElementById("formTitle").textContent = "Create New Post";
  document.getElementById("submitBtn").textContent = "Create Post";
  document.getElementById("cancelBtn").style.display = "none";
  editingPostId = null;
}

async function deletePost(id, title) {
  if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
    return;
  }

  try {
    const response = await fetch(`${URL}/${id}`, { method: "DELETE" });
    const result = await response.json();

    if (result.success) {
      showMessage("Post deleted successfully!");
      fetchPosts();
      if (editingPostId === id) resetForm();
    } else {
      showMessage(result.error || "Failed to delete post", "error");
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    showMessage("Failed to delete post. Please check your connection.", "error");
  }
}

document.addEventListener("DOMContentLoaded", fetchPosts);
