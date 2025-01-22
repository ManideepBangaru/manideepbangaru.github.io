document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('blog-search');
    const searchSuggestions = document.getElementById('search-suggestions');
    const categorySelect = document.getElementById('category-select');
    const blogList = document.getElementById('blog-list');
    const notebookContainer = document.getElementById('notebook-container');

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
            populateCategorySelect();
            displayBlogs(Object.entries(blogPosts)); // Show all blogs initially
        } catch (error) {
            console.error('Error loading blog data:', error);
            blogList.innerHTML = '<p class="error-message">Failed to load blog posts. Please try again later.</p>';
        }
    }

    // Populate category select dropdown
    function populateCategorySelect() {
        Object.keys(categories).forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    // Display blogs based on the provided posts
    function displayBlogs(posts) {
        blogList.innerHTML = ''; // Clear existing content
        posts.forEach(([title, url]) => {
            const blogCard = document.createElement('div');
            blogCard.className = 'blog-card';
            blogCard.innerHTML = `
                <h3>${title}</h3>
                <div class="blog-links">
                    <a href="${url}" target="_blank" class="read-more">View on GitHub</a>
                    <button class="view-notebook" data-url="${url}">View Notebook</button>
                </div>
            `;
            blogList.appendChild(blogCard);
        });

        // Add event listeners for notebook buttons
        document.querySelectorAll('.view-notebook').forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link behavior
                const notebookUrl = this.getAttribute('data-url');
                fetchNotebookContent(notebookUrl);
            });
        });
    }

    // Function to fetch and display notebook content
    async function fetchNotebookContent(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const notebookContent = await response.json();
            displayNotebook(notebookContent);
        } catch (error) {
            console.error('Error fetching notebook:', error);
            notebookContainer.innerHTML = '<p class="error-message">Failed to load notebook. Please try again later.</p>';
        }
    }

    // Function to display the notebook content
    function displayNotebook(notebook) {
        notebookContainer.innerHTML = ''; // Clear previous content

        // Convert notebook cells to HTML
        notebook.cells.forEach(cell => {
            const cellDiv = document.createElement('div');
            if (cell.cell_type === 'markdown') {
                cellDiv.innerHTML = marked(cell.source.join('')); // Use marked.js to convert markdown to HTML
            } else if (cell.cell_type === 'code') {
                cellDiv.className = 'code-cell';
                cellDiv.innerHTML = `<pre>${cell.source.join('')}</pre>`;
            }
            notebookContainer.appendChild(cellDiv);
        });

        // Show the notebook container
        notebookContainer.style.display = 'block';
    }

    // Search functionality with suggestions
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
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
                    searchInput.value = suggestion; // Set the input value
                    searchSuggestions.innerHTML = ''; // Clear suggestions
                    searchSuggestions.style.display = 'none'; // Hide suggestions
                    searchSuggestions.classList.add('empty'); // Add empty class to remove border
                    filterBlogs(); // Call filter function
                });
                searchSuggestions.appendChild(div);
            });
            searchSuggestions.style.display = 'block'; // Show suggestions
            searchSuggestions.classList.remove('empty'); // Ensure empty class is removed
        } else {
            searchSuggestions.style.display = 'none'; // Hide suggestions if no search term
            searchSuggestions.classList.add('empty'); // Add empty class if no suggestions
        }

        // Show all blogs if search term is empty
        if (searchTerm.length === 0) {
            searchSuggestions.style.display = 'none'; // Hide suggestions
            searchSuggestions.classList.add('empty'); // Add empty class to remove border
            displayBlogs(Object.entries(blogPosts)); // Show all blogs
        }
    });

    // Function to filter blogs based on search term and selected category
    function filterBlogs() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value;

        const filteredPosts = Object.entries(blogPosts).filter(([title]) => {
            const matchesSearch = title.toLowerCase().includes(searchTerm);
            const matchesCategory = !selectedCategory || 
                (categories[selectedCategory] && categories[selectedCategory].includes(title));
            return matchesSearch && matchesCategory;
        });

        displayBlogs(filteredPosts);
    }

    // Event listener for category selection
    categorySelect.addEventListener('change', filterBlogs);

    // Initial load
    loadData();
}); 