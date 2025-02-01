document.addEventListener('DOMContentLoaded', function() {
    const markdownContainer = document.createElement('div');
    markdownContainer.id = 'markdown-content';
    markdownContainer.className = 'blog-container';
    document.querySelector('.content').appendChild(markdownContainer);

    // Configure marked options for better blog styling
    marked.use({
        headerIds: true,
        mangle: false,
        breaks: true,
        gfm: true
    });

    fetch('assets/library.md')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(markdown => {
            const template = `
                <article class="blog-post">
                    ${marked.parse(markdown)}
                </article>
            `;
            document.getElementById('markdown-content').innerHTML = template;
        })
        .catch(error => {
            console.error('Error loading markdown:', error);
            document.getElementById('markdown-content').innerHTML = 
                '<div class="error-message">Error loading content. Please try again later.</div>';
        });
}); 