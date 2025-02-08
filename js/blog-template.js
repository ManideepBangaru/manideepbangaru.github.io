document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Get the blog URL from query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const blogUrl = urlParams.get('post');

        if (!blogUrl) {
            throw new Error('No blog post specified');
        }

        // Fetch blog metadata from catalog
        const catalogResponse = await fetch('assets/blog_catalog.json');
        const catalog = await catalogResponse.json();
        const blogMeta = catalog.blogs.find(blog => blog.source_url === blogUrl);

        if (!blogMeta) {
            throw new Error('Blog post not found in catalog');
        }

        // Update page title
        document.title = `${blogMeta.title} - Manideep Bangaru`;

        // Update metadata
        document.getElementById('blogDate').textContent = new Date(blogMeta.date)
            .toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

        const tagsContainer = document.getElementById('blogTags');
        blogMeta.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'blog-tag';
            tagSpan.textContent = tag;
            tagsContainer.appendChild(tagSpan);
        });

        // Fetch and render markdown content
        const response = await fetch(blogUrl);
        const markdown = await response.text();

        // Configure marked options
        marked.setOptions({
            highlight: function(code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    return hljs.highlight(code, { language: lang }).value;
                }
                return hljs.highlightAuto(code).value;
            },
            breaks: true,
            gfm: true
        });

        // Render markdown
        const blogContent = document.getElementById('blogContent');
        blogContent.innerHTML = marked.parse(markdown);

        // Initialize syntax highlighting
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });

    } catch (error) {
        console.error('Error loading blog post:', error);
        document.getElementById('blogContent').innerHTML = `
            <div class="error-message">
                <h2>Error Loading Blog Post</h2>
                <p>${error.message}</p>
                <a href="blog.html">Return to Blog List</a>
            </div>
        `;
    }
}); 