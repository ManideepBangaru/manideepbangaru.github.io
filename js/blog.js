document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('blog-search');
    const searchSuggestions = document.getElementById('search-suggestions');
    const categorySelect = document.getElementById('category-select');
    const blogList = document.getElementById('blog-list');
    
    let blogPosts = {};

    // Load blog posts and categories data
    async function loadData() {
        try {
            const postsResponse = await fetch('./assets/data/blog-posts.json');
            blogPosts = await postsResponse.json();
            
            // Extract unique categories from blog posts
            const uniqueCategories = [...new Set(
                Object.values(blogPosts).map(post => post.category)
            )];
            
            // Populate category select
            uniqueCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });

            // Initial display of all blogs
            displayBlogs(Object.entries(blogPosts));
        } catch (error) {
            console.error('Error loading blog data:', error);
        }
    }

    // Convert GitHub blob URL to raw content URL
    function getNotebookViewerUrl(githubUrl) {
        // Use nbviewer.org to render the notebook
        return `https://nbviewer.org/github/${githubUrl.split('github.com/')[1]}`;
    }

    // Get repository info from GitHub URL
    function getRepoInfo(githubUrl) {
        const parts = githubUrl.split('/');
        const username = parts[3];
        const repo = parts[4];
        const path = parts.slice(7).join('/');
        return { username, repo, path };
    }

    // Search functionality with suggestions
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        // Filter blog posts based on search term
        filterBlogs();

        // Show suggestions
        const suggestions = Object.keys(blogPosts).filter(title => 
            title.toLowerCase().includes(searchTerm)
        );

        searchSuggestions.innerHTML = '';
        if (searchTerm.length > 0 && suggestions.length > 0) {
            suggestions.forEach(suggestion => {
                const div = document.createElement('div');
                div.className = 'suggestion';
                div.textContent = suggestion;
                div.addEventListener('click', () => {
                    searchInput.value = suggestion;
                    searchSuggestions.innerHTML = '';
                    searchSuggestions.style.display = 'none';
                    searchSuggestions.classList.add('empty');
                    filterBlogs();
                });
                searchSuggestions.appendChild(div);
            });
            searchSuggestions.style.display = 'block';
            searchSuggestions.classList.remove('empty');
        } else {
            searchSuggestions.style.display = 'none';
            searchSuggestions.classList.add('empty');
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            searchSuggestions.innerHTML = '';
        }
    });

    // Category filter
    categorySelect.addEventListener('change', filterBlogs);

    function filterBlogs() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value;

        const filteredPosts = Object.entries(blogPosts).filter(([title, post]) => {
            const matchesSearch = title.toLowerCase().includes(searchTerm);
            const matchesCategory = !selectedCategory || post.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        displayBlogs(filteredPosts);
    }

    // Add marked.js for markdown parsing
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    document.head.appendChild(script);

    async function displayBlogs(posts) {
        blogList.innerHTML = '';
        posts.forEach(([title, post]) => {
            const blogCard = document.createElement('div');
            blogCard.className = 'blog-card';
            blogCard.innerHTML = `
                <h3>${title}</h3>
                <div class="summary">${post.summary}</div>
                <div class="category">${post.category}</div>
            `;
            
            // Add click handler
            blogCard.addEventListener('click', async () => {
                if (post.path.endsWith('.md')) {
                    await displayMarkdownContent(post.path, title);
                } else {
                    window.open(getNotebookViewerUrl(post.path), '_blank');
                }
            });
            
            blogList.appendChild(blogCard);
        });
    }

    async function displayMarkdownContent(path, title) {
        try {
            const response = await fetch(path);
            const markdown = await response.text();
            
            // Create back button
            const buttonWrapper = document.createElement('div');
            buttonWrapper.className = 'back-button-wrapper';

            const backButton = document.createElement('button');
            backButton.className = 'back-button';
            backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Blogs';
            backButton.onclick = () => {
                filterBlogs();
            };

            buttonWrapper.appendChild(backButton);
            
            // Create markdown container
            const markdownContainer = document.createElement('div');
            markdownContainer.className = 'markdown-content';
            
            // Set the content
            blogList.innerHTML = '';
            blogList.appendChild(buttonWrapper);
            blogList.appendChild(markdownContainer);
            
            // Parse and render markdown
            markdownContainer.innerHTML = marked.parse(markdown);
            
            // Add syntax highlighting if you want to support code blocks
            if (window.hljs) {
                document.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightBlock(block);
                });
            }
            
        } catch (error) {
            console.error('Error loading markdown:', error);
            blogList.innerHTML = `<div class="error">Error loading content</div>`;
        }
    }

    // Initial load
    loadData();
}); 