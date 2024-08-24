const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log('Connected to websocket server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from websocket server');
});

socket.on('PostsUpdate', (posts) => {
    console.log('Posts updated', posts);

    const postsList = document.querySelector('.posts');
    const existingPosts = document.querySelectorAll('.post:not(form)');
    existingPosts.forEach(post => {
        post.remove();
    });
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        const title = document.createElement('p');
        title.className = 'post__title';
        title.textContent = post.title;

        const content = document.createElement('p');
        content.className = 'post__body';
        content.textContent = post.content;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'post__delete';
        deleteButton.onclick = () => deletePost(post.id);

        postElement.appendChild(title);
        postElement.appendChild(content);
        postElement.appendChild(deleteButton);

        postsList.appendChild(postElement);
    });
});