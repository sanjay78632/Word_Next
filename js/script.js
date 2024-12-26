// JavaScript for Blog Website using jQuery

// Initial Blogs Data
// JavaScript for Blog Website using jQuery

let blogs = []; // This will hold our blogs data
let blogToDeleteIndex = null;

// Fetch Blogs from localStorage or blogs.json on page load
$(document).ready(function() {
    // Load from localStorage first
    const storedBlogs = JSON.parse(localStorage.getItem('blogs')) || [];

    // If no blogs are found in localStorage, load blogs from blogs.json
    if (storedBlogs.length === 0) {
        $.getJSON('blogs.json', function(data) {
            blogs = data; // Store the fetched data into the blogs array
            displayBlogs(); // Display the blogs after loading
        }).fail(function() {
            alert('Failed to load blogs from the JSON file.');
        });
    } else {
        blogs = storedBlogs; // Use localStorage data if available
        displayBlogs(); // Display the blogs loaded from localStorage
    }

    // Event Listener for Form Submission
    $('#createPostForm').on('submit', addBlog);

    // Event Listeners for Filters
    $('#filterCategory').on('change', displayBlogs);
    $('#filterTitle').on('input', displayBlogs);
});

// Function to Display Blogs
function displayBlogs() {
    const blogList = $('#blogList');
    blogList.empty();

    const selectedCategory = $('#filterCategory').val();
    const searchText = $('#filterTitle').val().toLowerCase();

    // Define colors for each category
    const categoryColors = {
        Technology: 'bg-primary',
        Lifestyle: 'bg-info',
        Learning: 'bg-success',
        
    };

    // Filter blogs based on category, title, and author
    const filteredBlogs = blogs.filter(blog => {
        const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
        const matchesSearch = 
            blog.title.toLowerCase().includes(searchText) || 
            blog.author.toLowerCase().includes(searchText);
        return matchesCategory && matchesSearch;
    });

    // Reverse the filtered blogs array to show the latest blogs first
    const sortedBlogs = [...filteredBlogs].reverse();

    if (sortedBlogs.length === 0) {
        blogList.html('<p class="text-center">No blogs found</p>');
    } else {
        sortedBlogs.forEach((blog, index) => {
            // Calculate the actual index of the blog in the original array
            const actualIndex = blogs.indexOf(blog);

            // Get the color class for the category
            const categoryColorClass = categoryColors[blog.category] || categoryColors.Default;

            const blogCard = `
                <div class="col-md-4 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${blog.title}</h5>
                            <p class="text-muted">By: ${blog.author}</p>
                            <span class="badge ${categoryColorClass}">${blog.category}</span>
                            <p class="card-text mt-2">${blog.description.substring(0, 100)}...</p>
                            <button class="btn btn-sm btn-primary" onclick="viewBlog(${actualIndex})">Load More</button>
                            <button class="btn btn-sm btn-danger" onclick="confirmDelete(${actualIndex})">Delete</button>
                        </div>
                    </div>
                </div>
            `;
            blogList.append(blogCard);
        });
    }
}



// Function to Add Blog
function addBlog(event) {
    event.preventDefault();

    // Get the values from the form
    const title = $('#postTitle').val().trim();
    const category = $('#postCategory').val().trim();
    const description = $('#postDescription').val().trim();
    const author = $('#postAuthor').val().trim();

    // Create a new blog object
    const newBlog = { title, category, description, author };

    // Check if any required field is empty, if so, return without adding the blog
    if (Object.values(newBlog).some(value => value === '')) {
        return; // Do not add empty blog
    }

    // Add the new blog to the blogs array
    blogs.push(newBlog);

    // Save the updated blogs array to localStorage
    localStorage.setItem('blogs', JSON.stringify(blogs));
    displayBlogs(); // Refresh the blog list

    // Reset Form and Close Modal
    $('#createPostForm')[0].reset();
    const createPostModal = bootstrap.Modal.getInstance($('#createPostModal')[0]);
    createPostModal.hide();
}

// Function to View Blog
function viewBlog(index) {
    const blog = blogs[index];
    $('#viewBlogModalLabel').text(blog.title);
    $('#viewBlogContent').html(`
        <p><strong>Author:</strong> ${blog.author}</p>
        <p><strong>Category:</strong> ${blog.category}</p>
        <p>${blog.description}</p>
    `);

    const viewBlogModal = new bootstrap.Modal($('#viewBlogModal')[0]);
    viewBlogModal.show();
}

// Function to Delete Blog
function confirmDelete(index) {
    blogToDeleteIndex = index; // Save the actual index of the blog to be deleted
    const deleteConfirmationModal = new bootstrap.Modal($('#deleteConfirmationModal')[0]);
    deleteConfirmationModal.show();
}

$('#confirmDeleteButton').on('click', () => {
    if (blogToDeleteIndex !== null) {
        blogs.splice(blogToDeleteIndex, 1); // Remove the correct blog from the array
        localStorage.setItem('blogs', JSON.stringify(blogs)); // Update localStorage
        displayBlogs(); // Refresh the blog list
    }
    const deleteConfirmationModal = bootstrap.Modal.getInstance($('#deleteConfirmationModal')[0]);
    deleteConfirmationModal.hide(); // Close the modal
});
// Event Listener for Form Submission
$('#createPostForm').on('submit', addBlog);

// Event Listeners for Filters
$('#filterCategory').on('change', displayBlogs);
$('#filterTitle').on('input', displayBlogs);

// Display Blogs on Page Load
displayBlogs();
