document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('blog-search');
    const searchSuggestions = document.getElementById('search-suggestions');
    const categorySelect = document.getElementById('category-select');
    const blogList = document.getElementById('blog-list');
    
    let blogPosts = {};
    let categories = {};

    // Load blog posts and categories data
    async function loadData() {
        try {
            const [postsResponse, categoriesResponse] = await Promise.all([
                fetch('./assets/data/blog-posts.json'),
                fetch('./assets/data/blog-categories.json')
            ]);
            
            blogPosts = await postsResponse.json();
            categories = await categoriesResponse.json();
            
            // Populate category select
            Object.keys(categories).forEach(category => {
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
        const suggestions = Object.keys(blogPosts).filter(title => 
            title.toLowerCase().includes(searchTerm)
        );

        // Show suggestions
        searchSuggestions.innerHTML = '';
        if (searchTerm.length > 0 && suggestions.length > 0) {
            suggestions.forEach(suggestion => {
                const div = document.createElement('div');
                div.className = 'suggestion';
                div.textContent = suggestion;
                div.addEventListener('click', () => {
                    searchInput.value = suggestion;
                    searchSuggestions.innerHTML = '';
                    filterBlogs();
                });
                searchSuggestions.appendChild(div);
            });
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

        const filteredPosts = Object.entries(blogPosts).filter(([title, path]) => {
            const matchesSearch = title.toLowerCase().includes(searchTerm);
            const matchesCategory = !selectedCategory || 
                (categories[selectedCategory] && categories[selectedCategory].includes(path));
            return matchesSearch && matchesCategory;
        });

        displayBlogs(filteredPosts);
    }

    function displayBlogs(posts) {
        // First, ensure the search section has the correct structure
        const searchSection = document.querySelector('.search-section');
        if (!searchSection.querySelector('.search-bar-wrapper')) {
            // Restructure the search section
            const searchBarWrapper = document.createElement('div');
            searchBarWrapper.className = 'search-bar-wrapper';
            
            // Move existing elements into wrapper
            const searchBar = searchSection.querySelector('.search-bar');
            const categoryFilter = searchSection.querySelector('.category-filter');
            
            searchBarWrapper.appendChild(searchBar);
            searchBarWrapper.appendChild(categoryFilter);
            
            // Insert wrapper after search suggestions
            const searchSuggestions = searchSection.querySelector('.search-suggestions');
            searchSuggestions.parentNode.insertBefore(searchBarWrapper, searchSuggestions);
        }

        // Rest of the display logic
        blogList.innerHTML = '';
        posts.forEach(([title, githubUrl]) => {
            const repoInfo = getRepoInfo(githubUrl);
            const nbviewerUrl = getNotebookViewerUrl(githubUrl);
            
            const blogCard = document.createElement('div');
            blogCard.className = 'blog-card';
            blogCard.innerHTML = `
                <h3>${title}</h3>
                <div class="blog-links">
                    <a href="${nbviewerUrl}" target="_blank" class="view-notebook">
                        <i class="fas fa-book-reader"></i> View Notebook
                    </a>
                    <a href="${githubUrl}" target="_blank" class="github-link">
                        <i class="fab fa-github"></i> View on GitHub
                    </a>
                </div>
                <div class="repo-info">
                    <span><i class="fas fa-code-branch"></i> ${repoInfo.repo}</span>
                    <span><i class="fas fa-folder"></i> ${repoInfo.path}</span>
                </div>
            `;
            blogList.appendChild(blogCard);
        });
    }

    // Initial load
    loadData();
}); 