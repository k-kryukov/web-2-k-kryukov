document.addEventListener('DOMContentLoaded', function() {
  try {
    document.getElementById("postSubmit").addEventListener("click", async function(event) {
      event.preventDefault();
      const titleObject = document.getElementById("postTitle");
      const contentObject = document.getElementById("postContent");
      const title = titleObject.value
      const content = contentObject.value

      if (!title || !content) {
        return;
      }

      titleObject.value = "";
      contentObject.value = "";

      socket.emit('createPost', { title, content });

      Toastify({
        text: "Пост создан!",
        duration: 3000
      }).showToast();
    })
  } catch {}
});

async function deletePost(id) {
  socket.emit('deletePost', id);

  Toastify({
    text: "Пост удален!",
    duration: 3000
  }).showToast();
}