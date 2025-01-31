const PROJECT_ID = "your-project-id";  // Replace with your Sanity project ID
const DATASET = "production";          // Replace with your dataset name (default is "production")
const QUERY = encodeURIComponent(`*[_type == "blog"]{title, slug, body, publishedAt}`); 
const API_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`;

async function fetchBlogs() {
    try {
        const response = await fetch(API_URL);
        const { result } = await response.json();

        const blogContainer = document.getElementById("blog-container");
        blogContainer.innerHTML = ""; // Clear previous content

        result.forEach(blog => {
            const blogPost = document.createElement("div");
            blogPost.classList.add("blog-post");
            blogPost.innerHTML = `
                <h2>${blog.title}</h2>
                <p>${new Date(blog.publishedAt).toLocaleDateString()}</p>
                <p>${blog.body.substring(0, 200)}...</p>
                <a href="blog.html?slug=${blog.slug.current}">Read More</a>
            `;
            blogContainer.appendChild(blogPost);
        });
    } catch (error) {
        console.error("Error fetching blogs:", error);
    }
}

// Fetch blogs on page load
document.addEventListener("DOMContentLoaded", fetchBlogs);