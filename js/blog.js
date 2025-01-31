document.addEventListener("DOMContentLoaded", async function () {
    const blogContainer = document.getElementById("blog-container");

    const projectId = "1k7mvxx4"; // Replace with your Sanity Project ID
    const dataset = "production"; // Replace with your dataset (e.g., "production")
    const query = encodeURIComponent('*[_type == "post"]{title, body, "imageUrl": mainImage.asset->url}');
    const url = `https://${projectId}.api.sanity.io/v2021-10-21/data/query/${dataset}?query=${query}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const posts = data.result;

        if (posts.length === 0) {
            blogContainer.innerHTML = "<p>No blog posts available.</p>";
            return;
        }

        blogContainer.innerHTML = posts.map(post => `
            <div class="blog-post">
                <h2>${post.title}</h2>
                <p>${post.body}</p>
            </div>
        `).join("");

    } catch (error) {
        console.error("Error fetching blogs:", error);
        blogContainer.innerHTML = "<p>Failed to load blog posts.</p>";
    }
});