 const URL = "http://localhost:3000/api/posts";

        // GET posts
        async function fetchPosts() {
            try {
                const postsDiv = document.getElementById("posts");
                postsDiv.innerHTML = '<div class="loading">Loading posts...</div>';

                const res = await fetch(URL);
                const data = await res.json();

                postsDiv.innerHTML = "";

                if (!data.success || !data.data || data.data.length === 0) {
                    postsDiv.innerHTML = '<div class="no-posts">No posts yet. Create one!</div>';
                    return;
                }

                const posts = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                posts.forEach(post => {
                    const div = document.createElement("div");
                    div.className = "post";
                    div.innerHTML = `
    <h3 class="post-title">${escapeHtml(post.title)}</h3>
    <div class="post-content">${escapeHtml(post.content)}</div>
    <p class="post-author">👤Author : ${escapeHtml(post.author)}</p>
    <p style="color: #718096; font-size: 12px; margin-top: 10px;">
      📅 Created: ${new Date(post.createdAt).toLocaleString()}
    </p>
    ${post.updatedAt && post.updatedAt !== post.createdAt
                            ? `<p style="color: #718096; font-size: 12px; margin-top: 2px;">
             🔄 Updated: ${new Date(post.updatedAt).toLocaleString()}
           </p>`
                            : ""
                        }
  `;
                    postsDiv.appendChild(div);
                });

            } catch (error) {
                console.error("Error fetching posts:", error);
                document.getElementById("posts").innerHTML = '<div class="no-posts">Failed to load posts.</div>';
            }
        }


        document.getElementById("postForm").addEventListener("submit", async (e) => {
            e.preventDefault();

            const title = document.getElementById("title").value.trim();
            const content = document.getElementById("content").value.trim();
            const author = document.getElementById("author").value.trim();

            if (!title || !content || !author) return;

            try {
                await fetch(URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, content, author })
                });

                document.getElementById("postForm").reset();
                fetchPosts();
            } catch (error) {
                console.error("Error creating post:", error);
            }
        });

        function escapeHtml(text) {
            const div = document.createElement("div");
            div.textContent = text;
            return div.innerHTML;
        }

        document.addEventListener("DOMContentLoaded", fetchPosts);