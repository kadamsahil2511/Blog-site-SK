document.addEventListener('DOMContentLoaded', function() {

    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
    
    const posts = document.querySelectorAll('.post');
    const sidebarSections = document.querySelectorAll('.sidebar-section');
    
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    function animateOnScroll() {
        posts.forEach(post => {
            if (isInViewport(post) && !post.classList.contains('animate-up')) {
                post.classList.add('animate-up');
            }
        });
        
        sidebarSections.forEach(section => {
            if (isInViewport(section) && !section.classList.contains('animate-up')) {
                section.classList.add('animate-up');
            }
        });
    }
    
    animateOnScroll();
    
    // Handle voting functionality
    const voteButtons = document.querySelectorAll('.vote-buttons button');
    voteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const voteContainer = this.closest('.vote-buttons');
            const voteCount = voteContainer.querySelector('.vote-count');
            const currentCount = parseInt(voteCount.textContent);
            const upvote = voteContainer.querySelector('.upvote');
            const downvote = voteContainer.querySelector('.downvote');
            
            if (this.classList.contains('upvote')) {
                if (this.classList.contains('active')) {
                    // Remove upvote
                    voteCount.textContent = currentCount - 1;
                    this.classList.remove('active');
                } else {
                    // Add upvote, remove downvote if exists
                    if (downvote.classList.contains('active')) {
                        voteCount.textContent = currentCount + 2;
                        downvote.classList.remove('active');
                    } else {
                        voteCount.textContent = currentCount + 1;
                    }
                    this.classList.add('active');
                }
            } else if (this.classList.contains('downvote')) {
                if (this.classList.contains('active')) {
                    // Remove downvote
                    voteCount.textContent = currentCount + 1;
                    this.classList.remove('active');
                } else {
                    // Add downvote, remove upvote if exists
                    if (upvote.classList.contains('active')) {
                        voteCount.textContent = currentCount - 2;
                        upvote.classList.remove('active');
                    } else {
                        voteCount.textContent = currentCount - 1;
                    }
                    this.classList.add('active');
                }
            }
        });
    });
    
    window.addEventListener('scroll', animateOnScroll);
    
    // Post Creation Logic
    const createPostBtn = document.querySelector('.create-post');
    const postCreationWindow = document.getElementById('postCreationWindow');
    const cancelPostBtn = document.getElementById('cancelPost');
    const newPostForm = document.getElementById('newPostForm');
    const postList = document.querySelector('.post-list');
    
    // Initialize UI elements
    const postTypeButtons = document.querySelectorAll('.post-type');
    const toolButtons = document.querySelectorAll('.tool-button');
    const viewOptions = document.querySelectorAll('.view-option');
    // Using sortButtons instead of declaring a new variable
    // const sortButtons = document.querySelectorAll('.sort-options button');
    const tagFilters = document.querySelectorAll('.tag-filter');
    const threadsViewToggle = document.getElementById('threaded-view');
    
    // Check if username is set, if not prompt for it
    if (!localStorage.getItem('username')) {
        const username = prompt('Please enter your username for posting:', 'redditor');
        if (username) {
            localStorage.setItem('username', username);
        } else {
            localStorage.setItem('username', 'redditor');
        }
    }
    
    // Handle post type selection
    postTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            postTypeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const postType = this.dataset.type;
            const contentArea = document.getElementById('postContent');
            
            // Change placeholder based on post type
            switch(postType) {
                case 'text':
                    contentArea.placeholder = 'What are your thoughts?';
                    break;
                case 'image':
                    contentArea.placeholder = 'Add image URL or drag and drop images here';
                    break;
                case 'link':
                    contentArea.placeholder = 'URL';
                    break;
                case 'poll':
                    contentArea.placeholder = 'Poll question';
                    break;
            }
        });
    });
    
    // Handle formatting tools
    toolButtons.forEach(button => {
        button.addEventListener('click', function() {
            const contentArea = document.getElementById('postContent');
            const selection = contentArea.value.substring(
                contentArea.selectionStart, 
                contentArea.selectionEnd
            );
            
            let formatter = '';
            
            switch(this.title) {
                case 'Add formatting':
                    formatter = `**${selection}**`;
                    break;
                case 'Add italic':
                    formatter = `*${selection}*`;
                    break;
                case 'Add link':
                    formatter = `[${selection}](url)`;
                    break;
                case 'Add code':
                    formatter = `\`${selection}\``;
                    break;
                case 'Add spoiler':
                    formatter = `>!${selection}!<`;
                    break;
            }
            
            if (selection) {
                document.execCommand('insertText', false, formatter);
            }
        });
    });
    
    // Handle view options
    viewOptions.forEach(option => {
        option.addEventListener('click', function() {
            viewOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            const viewType = this.dataset.view;
            document.querySelector('.post-list').className = `post-list view-${viewType}`;
            
            // Apply specific styling based on view type
            const posts = document.querySelectorAll('.post');
            posts.forEach(post => {
                switch(viewType) {
                    case 'card':
                        post.style.padding = '1rem';
                        post.style.margin = '0 0 1rem 0';
                        break;
                    case 'classic':
                        post.style.padding = '0.75rem';
                        post.style.margin = '0 0 0.5rem 0';
                        break;
                    case 'compact':
                        post.style.padding = '0.5rem';
                        post.style.margin = '0 0 0.25rem 0';
                        // Make the title and content more compact
                        const title = post.querySelector('.post-title');
                        if (title) title.style.fontSize = '0.95rem';
                        const content = post.querySelector('.post-content p');
                        if (content) content.style.maxHeight = '2.8em';
                        break;
                }
            });
            
            // Save preference to localStorage
            localStorage.setItem('preferredView', viewType);
        });
    });
    
    // Handle sort options
    sortButtons.forEach(button => {
        button.addEventListener('click', function() {
            sortButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Simulate sorting posts
            const sortType = this.textContent.trim();
            showToast(`Posts sorted by: ${sortType}`);
        });
    });
    
    // Handle threaded view toggle
    if (threadsViewToggle) {
        threadsViewToggle.addEventListener('change', function() {
            const posts = document.querySelectorAll('.post');
            if (this.checked) {
                posts.forEach(post => {
                    post.classList.add('threaded');
                });
                localStorage.setItem('threadedView', 'true');
                showToast('Threaded view enabled');
            } else {
                posts.forEach(post => {
                    post.classList.remove('threaded');
                });
                localStorage.setItem('threadedView', 'false');
                showToast('Threaded view disabled');
            }
        });
        
        // Check saved preference
        if (localStorage.getItem('threadedView') === 'true') {
            threadsViewToggle.checked = true;
            threadsViewToggle.dispatchEvent(new Event('change'));
        }
    }
    
    // Handle tag filters
    tagFilters.forEach(tag => {
        tag.addEventListener('click', function() {
            if (this.textContent !== '+') {
                this.classList.toggle('active');
            }
        });
    });
    
    // Allow closing with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && postCreationWindow.style.display === 'block') {
            postCreationWindow.style.display = 'none';
            newPostForm.reset();
        }
    });
    
    // Toast notification function
    function showToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <div class="toast-content">${message}</div>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast with animation
        setTimeout(() => {
            toast.classList.add('active');
        }, 10);
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // Open post creation window
    createPostBtn.addEventListener('click', function() {
        postCreationWindow.style.display = 'block';
        createPostBtn.style.display = 'none';
        // Set focus on title input after a short delay to allow animation
        setTimeout(() => document.getElementById('postTitle').focus(), 300);
    });
    
    // Close post creation window
    cancelPostBtn.addEventListener('click', function() {
        postCreationWindow.style.display = 'none';
        createPostBtn.style.display = 'flex';
        newPostForm.reset();
    });
    
    // Handle post submission
    newPostForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const postTitle = document.getElementById('postTitle').value;
        const postContent = document.getElementById('postContent').value;
        
        if (!postTitle.trim() || !postContent.trim()) {
            return;
        }
        
        // Get current time for the post timestamp
        const now = new Date();
        const timeAgo = 'just now';
        
        // Generate random vote count between 1 and 50
        const initialVotes = Math.floor(Math.random() * 50) + 1;
        
        // Create new post HTML
        const newPost = document.createElement('article');
        newPost.className = 'post animate-up';
        newPost.innerHTML = `
            <div class="vote-buttons">
                <button class="upvote" aria-label="Upvote"><i class="fas fa-arrow-up"></i></button>
                <span class="vote-count">${initialVotes}</span>
                <button class="downvote" aria-label="Downvote"><i class="fas fa-arrow-down"></i></button>
            </div>
            <div class="post-content">
                <div class="post-info">
                    <span class="post-subreddit">r/webdev</span>
                    <span class="post-user">Posted by u/${localStorage.getItem('username') || 'redditor'}</span>
                    <span class="post-time">${timeAgo}</span>
                </div>
                <h3 class="post-title">${postTitle}</h3>
                <p>${postContent}</p>
                <div class="post-actions">
                    <button><i class="far fa-comment-alt"></i> 0 comments</button>
                    <button><i class="fas fa-share"></i> Share</button>
                    <button><i class="far fa-bookmark"></i> Save</button>
                    <button><i class="fas fa-ellipsis-h"></i></button>
                </div>
            </div>
        `;
        
        // Add voting functionality to the new post
        const newVoteButtons = newPost.querySelectorAll('.vote-buttons button');
        newVoteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const voteContainer = this.closest('.vote-buttons');
                const voteCount = voteContainer.querySelector('.vote-count');
                const currentCount = parseInt(voteCount.textContent);
                const upvote = voteContainer.querySelector('.upvote');
                const downvote = voteContainer.querySelector('.downvote');
                
                if (this.classList.contains('upvote')) {
                    if (this.classList.contains('active')) {
                        voteCount.textContent = currentCount - 1;
                        this.classList.remove('active');
                    } else {
                        if (downvote.classList.contains('active')) {
                            voteCount.textContent = currentCount + 2;
                            downvote.classList.remove('active');
                        } else {
                            voteCount.textContent = currentCount + 1;
                        }
                        this.classList.add('active');
                    }
                } else if (this.classList.contains('downvote')) {
                    if (this.classList.contains('active')) {
                        voteCount.textContent = currentCount + 1;
                        this.classList.remove('active');
                    } else {
                        if (upvote.classList.contains('active')) {
                            voteCount.textContent = currentCount - 2;
                            upvote.classList.remove('active');
                        } else {
                            voteCount.textContent = currentCount - 1;
                        }
                        this.classList.add('active');
                    }
                }
            });
        });
        
        // Add the new post at the beginning of the post list
        postList.insertBefore(newPost, postList.firstChild);
        
        // Manually add pseudo-element for the orange bar animation
        const orangeBar = document.createElement('div');
        orangeBar.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 0;
            background-color: #ff4500;
            transition: height 0.25s ease;
        `;
        newPost.style.position = 'relative';
        newPost.style.overflow = 'hidden';
        newPost.appendChild(orangeBar);
        
        // Add hover effects to the new post
        newPost.addEventListener('mouseenter', function() {
            this.style.borderColor = '#c8c8c8';
            this.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.15)';
            this.style.transform = 'translateY(-2px)';
            orangeBar.style.height = '100%';
        });
        
        newPost.addEventListener('mouseleave', function() {
            this.style.borderColor = 'transparent';
            this.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            this.style.transform = 'translateY(0)';
            orangeBar.style.height = '0';
        });
        
        // Show posting indicator
        const submitBtn = document.getElementById('submitPost');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Posting...';
        submitBtn.disabled = true;
        
        // Simulate network delay for a more realistic feel
        setTimeout(() => {
            // Scroll to the top of the post list to see the new post
            window.scrollTo({
                top: document.querySelector('.post-list').offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Reset form and hide post creation window
            newPostForm.reset();
            postCreationWindow.style.display = 'none';
            createPostBtn.style.display = 'flex';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Show success toast notification
            showToast('Post created successfully!');
        }, 1000);
    });
    
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuToggle.setAttribute('aria-label', 'Toggle Navigation Menu');
    
    const nav = document.querySelector('nav');
    const headerContainer = document.querySelector('.header-container');
    
    headerContainer.insertBefore(mobileMenuToggle, nav);
    
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        
        const icon = this.querySelector('i');
        if (nav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Sort posts functionality
    const sortButtons = document.querySelectorAll('.sort-options button');
    sortButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            sortButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // In a real app, this would trigger an API call to sort posts
            // For this demo, we'll just show a simple notification
            const sortType = this.textContent.trim();
            console.log(`Sorting by: ${sortType}`);
            
            // Simulated sort animation
            const posts = document.querySelectorAll('.post');
            posts.forEach(post => {
                post.style.opacity = '0.5';
                setTimeout(() => {
                    post.style.opacity = '1';
                }, 300);
            });
        });
    });
    
    // Join button functionality
    const joinButtons = document.querySelectorAll('.join-button');
    joinButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent === 'Join') {
                this.textContent = 'Joined';
                this.style.backgroundColor = '#edeff1';
                this.style.color = '#0079d3';
            } else {
                this.textContent = 'Join';
                this.style.backgroundColor = '';
                this.style.color = '';
            }
        });
    });
    
    // Post action buttons functionality
    const postActionButtons = document.querySelectorAll('.post-actions button');
    postActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const actionType = this.textContent.trim();
            
            // Save button toggle
            if (this.querySelector('.fa-bookmark')) {
                const icon = this.querySelector('i');
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    this.style.color = '#ff4500';
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    this.style.color = '';
                }
            }
        });
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Create post button functionality
    const createPostButton = document.querySelector('.create-post');
    if (createPostButton) {
        createPostButton.addEventListener('click', function() {
            alert('Create post functionality would open a form here.');
        });
    }
    
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
