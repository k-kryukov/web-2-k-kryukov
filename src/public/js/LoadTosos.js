window.addEventListener("DOMContentLoaded", function() {
  fetch('https://jsonplaceholder.typicode.com/todos')
    .then(response => response.json())
    .then(todos => {
      const index = Math.random() * (200 - 5)
      const todosList = document.getElementById("tasks")
      todosList.innerHTML = ""

      todos = todos.slice(index, index + 5)
      
      todos.forEach(todo => {
        if (todo.completed) {
          todosList.innerHTML += ` <div class="task">
            <input type="checkbox">
            <p class="task__title">${todo.title}</p>
          </div>`
        } else {
          todosList.innerHTML += ` <div class="task">
            <input type="checkbox" checked>
            <p class="task__title">${todo.title}</p>
          </div>`
        }
      });
    })
})