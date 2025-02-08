document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch blog catalog
        const response = await fetch('assets/blog_catalog.json');
        const data = await response.json();
        const blogs = data.blogs;
        
        console.log('Loaded blogs:', blogs); // Debug log

        // Extract and populate unique tags
        const uniqueTags = [...new Set(blogs.flatMap(blog => blog.tags))].sort();
        console.log('Unique tags:', uniqueTags); // Debug log
        
        const tagsFilter = document.getElementById('tagsFilter');
        uniqueTags.forEach(tag => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = tag;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${tag}`));
            tagsFilter.appendChild(label);
        });

        // Set default sort order to descending
        document.getElementById('dateSort').value = 'desc';

        // Filter function
        function filterBlogs() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const sortOrder = document.getElementById('dateSort').value;
            const selectedTags = [...document.querySelectorAll('#tagsFilter input:checked')].map(cb => cb.value);
            const selectedStatuses = [...document.querySelectorAll('#statusFilter input:checked')].map(cb => cb.value);

            console.log('Selected tags:', selectedTags); // Debug log

            let filteredBlogs = blogs.filter(blog => {
                const matchesSearch = blog.title.toLowerCase().includes(searchTerm) || 
                                    blog.description.toLowerCase().includes(searchTerm);
                
                // Check if blog has ALL selected tags (AND operation)
                const matchesTags = selectedTags.length === 0 || 
                                  selectedTags.every(tag => blog.tags.includes(tag));
                
                const matchesStatus = selectedStatuses.length === 0 || 
                                    selectedStatuses.includes(blog.status);
                
                return matchesSearch && matchesTags && matchesStatus;
            });

            // Sort blogs
            filteredBlogs.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            });

            console.log('Filtered blogs:', filteredBlogs); // Debug log
            displayBlogs(filteredBlogs);
        }

        // Display blogs function
        function displayBlogs(blogsToShow) {
            const blogList = document.getElementById('blogList');
            if (!blogList) {
                console.error('Blog list element not found!');
                return;
            }
            
            blogList.innerHTML = '';
            console.log('Displaying blogs:', blogsToShow);

            if (blogsToShow.length === 0) {
                blogList.innerHTML = '<p>No blogs found.</p>';
                return;
            }

            blogsToShow.forEach(blog => {
                const blogCard = document.createElement('div');
                blogCard.className = 'blog-card';
                
                // Format the date
                const formattedDate = new Date(blog.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                blogCard.innerHTML = `
                    <h3>${blog.title}</h3>
                    <p class="blog-description">${blog.description}</p>
                    <div class="blog-meta">
                        <span class="date">${formattedDate}</span>
                        <span class="status ${blog.status.toLowerCase()}">${blog.status}</span>
                    </div>
                    <div class="blog-tags">
                        ${blog.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                `;

                // Add click event to navigate to the blog template
                blogCard.addEventListener('click', () => {
                    window.location.href = `blog-template.html?post=${encodeURIComponent(blog.source_url)}`;
                });

                blogList.appendChild(blogCard);
            });
        }

        // Add event listeners
        document.getElementById('searchInput').addEventListener('input', filterBlogs);
        document.getElementById('dateSort').addEventListener('change', filterBlogs);
        document.querySelectorAll('#tagsFilter input, #statusFilter input').forEach(checkbox => {
            checkbox.addEventListener('change', filterBlogs);
        });

        // Add search suggestions functionality
        const searchInput = document.getElementById('searchInput');
        const searchSuggestions = document.getElementById('searchSuggestions');

        function showSuggestions(suggestions) {
            searchSuggestions.innerHTML = '';
            if (suggestions.length === 0) {
                searchSuggestions.style.display = 'none';
                return;
            }

            suggestions.forEach(suggestion => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.textContent = suggestion.title;
                div.addEventListener('click', () => {
                    searchInput.value = suggestion.title;
                    searchSuggestions.style.display = 'none';
                    filterBlogs();
                });
                searchSuggestions.appendChild(div);
            });
            searchSuggestions.style.display = 'block';
        }

        searchInput.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase();
            if (value.length === 0) {
                searchSuggestions.style.display = 'none';
                return;
            }

            const suggestions = blogs.filter(blog => 
                blog.title.toLowerCase().includes(value) ||
                blog.description.toLowerCase().includes(value)
            ).slice(0, 5); // Limit to 5 suggestions

            showSuggestions(suggestions);
        });

        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                searchSuggestions.style.display = 'none';
            }
        });

        // Initial display
        filterBlogs();

    } catch (error) {
        console.error('Error loading blogs:', error);
        const blogList = document.getElementById('blogList');
        if (blogList) {
            blogList.innerHTML = '<p>Error loading blogs. Please try again later.</p>';
        }
    }
}); 