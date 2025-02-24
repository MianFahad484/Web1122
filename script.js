// DOM Elements
const postForm = document.getElementById('post-form');
const postInput = document.getElementById('post-input');
const newsFeed = document.getElementById('news-feed');
const notificationBell = document.getElementById('notification-bell');
const notificationCount = document.getElementById('notification-count');
const notificationsPanel = document.getElementById('notifications-panel');

// Data
let posts = [];
let notifications = [];
let likeCounts = {};

// Functions

// Create a new post
function createPost(content) {
  const post = {
    id: Date.now(),
    content,
    likes: 0,
    comments: [],
    user: {
      name: 'John Doe',
      avatar: 'https://via.placeholder.com/50',
    },
  };
  posts.unshift(post); // Add to the beginning of the array
  renderPosts();
  addNotification(`New post: "${content.substring(0, 30)}..."`);
}

// Render posts
function renderPosts() {
  newsFeed.innerHTML = '';
  posts.forEach((post) => {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.innerHTML = `
      <div class="post-header">
        <img src="${post.user.avatar}" alt="${post.user.name}">
        <h3>${post.user.name}</h3>
      </div>
      <div class="post-content">
        <p>${post.content}</p>
      </div>
      <div class="post-actions">
        <button onclick="likePost(${post.id})">
          <i class="fas fa-thumbs-up"></i> Like (${post.likes})
        </button>
        <button onclick="toggleCommentForm(${post.id})">
          <i class="fas fa-comment"></i> Comment
        </button>
        <button onclick="sharePost(${post.id})">
          <i class="fas fa-share"></i> Share
        </button>
      </div>
      <div id="comments-${post.id}" class="comments-container"></div>
    `;
    newsFeed.appendChild(postElement);
    renderComments(post.id);
  });
}

// Like a post
function likePost(postId) {
  const post = posts.find((p) => p.id === postId);
  if (post) {
    post.likes++;
    renderPosts();
    addNotification(`You liked a post: "${post.content.substring(0, 30)}..."`);
  }
}

// Add a comment
function addComment(postId, comment) {
  const post = posts.find((p) => p.id === postId);
  if (post) {
    post.comments.push({
      user: {
        name: 'Jane Doe',
        avatar: 'https://via.placeholder.com/30',
      },
      content: comment,
    });
    renderComments(postId);
    addNotification(`New comment on your post: "${comment.substring(0, 30)}..."`);
  }
}

// Render comments
function renderComments(postId) {
  const commentsContainer = document.getElementById(`comments-${postId}`);
  if (commentsContainer) {
    commentsContainer.innerHTML = '';
    const post = posts.find((p) => p.id === postId);
    if (post) {
      post.comments.forEach((comment) => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `
          <div class="comment-header">
            <img src="${comment.user.avatar}" alt="${comment.user.name}">
            <h4>${comment.user.name}</h4>
          </div>
          <div class="comment-content">
            <p>${comment.content}</p>
          </div>
        `;
        commentsContainer.appendChild(commentElement);
      });
    }
  }
}

// Toggle comment form
function toggleCommentForm(postId) {
  const commentsContainer = document.getElementById(`comments-${postId}`);
  if (commentsContainer) {
    const existingForm = commentsContainer.querySelector('.comment-form');
    if (existingForm) {
      existingForm.remove();
    } else {
      const commentForm = document.createElement('div');
      commentForm.classList.add('comment-form');
      commentForm.innerHTML = `
        <textarea id="comment-input-${postId}" placeholder="Write a comment..."></textarea>
        <button onclick="submitComment(${postId})">Submit</button>
      `;
      commentsContainer.appendChild(commentForm);
    }
  }
}

// Submit comment
function submitComment(postId) {
  const commentInput = document.getElementById(`comment-input-${postId}`);
  if (commentInput && commentInput.value.trim()) {
    addComment(postId, commentInput.value.trim());
    commentInput.value = '';
  }
}

// Share a post
function sharePost(postId) {
  const post = posts.find((p) => p.id === postId);
  if (post) {
    alert(`Sharing post: "${post.content.substring(0, 30)}..."`);
    addNotification(`You shared a post: "${post.content.substring(0, 30)}..."`);
  }
}

// Add notification
function addNotification(message) {
  notifications.unshift({ id: Date.now(), message });
  updateNotificationUI();
}

// Update notification UI
function updateNotificationUI() {
  notificationCount.textContent = notifications.length;
  notificationsPanel.innerHTML = notifications
    .map(
      (notification) => `
      <div class="notification">
        <p>${notification.message}</p>
      </div>
    `
    )
    .join('');
}

// Toggle notifications panel
notificationBell.addEventListener('click', () => {
  notificationsPanel.classList.toggle('active');
});

// Event Listeners

// Submit post form
postForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (postInput.value.trim()) {
    createPost(postInput.value.trim());
    postInput.value = '';
  }
});

// Initial Render
renderPosts();

