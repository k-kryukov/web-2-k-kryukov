function supertokens_init() {
  supertokens.init({
    appInfo: {
      apiDomain: "http://localhost:3000",
      apiBasePath: "/auth",
      appName: "...",
    },
    recipeList: [
      supertokensSession.init(),
      supertokensEmailPassword.init(),
    ],
});
  console.log("supertokens initialized")
}

document.addEventListener('DOMContentLoaded', function() {
  const modalContainer = document.querySelector(".modal-container")

  modalContainer.addEventListener("click", function(event) {
    if (event.target === modalContainer) {
      hideLogin();
    }
  })

  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
      hideLogin();
    }
  });
})

async function showLogin() {
  const loginObject = document.querySelector(".login")
  loginObject.classList.add("login--visible")

  const modalContainer = document.querySelector(".modal-container")
  modalContainer.classList.add("modal-container--focus")

  const container = document.body
  container.classList.add("body--modal-opened")
}

async function hideLogin() {
  const loginObject = document.querySelector(".login")
  loginObject.classList.remove("login--visible")

  const modalContainer = document.querySelector(".modal-container")
  modalContainer.classList.remove("modal-container--focus")

  const container = document.body
  container.classList.remove("body--modal-opened")
}

async function login() {
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  if (!email || !password) return;

  let response = await supertokensEmailPassword.signIn({
    formFields: [
      {
        "id": "email",
        "value": email,
      },
      {
        "id": "password",
        "value": password,
      }
    ]
  })
  if (response.status === "OK") {
    Toastify({
      text: "Login successful",
      duration: 3000
    }).showToast();
    hideLogin();
    location.reload();
  } else {
    Toastify({
      text: "Wrong email or password",
      duration: 3000
    }).showToast();
  }
}

async function logout() {
  await supertokensEmailPassword.signOut()
  Toastify({
    text: "Logged out",
    duration: 3000
  }).showToast();
  location.reload();
}