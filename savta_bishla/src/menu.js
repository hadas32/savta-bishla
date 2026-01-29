import axios from "axios";

const btnLogin = document.querySelector('.openLogin');
const btnRegister = document.querySelector('.openRegister');
const modal = document.querySelector('.modal');
const closeModalBtn = document.querySelector('.close-modal');

function getPayloadFromToken(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
}

const token = localStorage.getItem("token");
const payload = token ? getPayloadFromToken(token) : null;

if (!payload || payload.role !== "admin") {
  document.querySelectorAll('.toAdmin').forEach(el => el.style.display = 'none');
} else {
  document.querySelectorAll('.toAdmin').forEach(el => el.style.display = 'block');
}

const statusContainer = document.querySelector('#user-status-container');
const userName = localStorage.getItem("userName");
const openModalItems = document.querySelectorAll('.openModal-item');

// פונקציית התנתקות ישירה
function handleLogout(event) {
  event.preventDefault();
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  window.location.reload();
}

function resetForm(selector, errorSelector) {
  const form = document.querySelector(selector);
  form.querySelectorAll("input").forEach(input => input.value = "");
  document.querySelector(errorSelector).textContent = "";
  return form;
}

function openLogin() {
  resetForm('.toLogin', ".errorMsgLogin");
  document.querySelector('.toLogin').style.display = "block";
  document.querySelector('.toRegister').style.display = "none";
  btnLogin.style.background = '#FFFDF6';
  btnRegister.style.background = '#d2d8d8c5';
}

function openRegister() {
  resetForm('.toRegister', ".errorMsgRegister");
  document.querySelector('.toRegister').style.display = "block";
  document.querySelector('.toLogin').style.display = "none";
  btnRegister.style.background = '#FFFDF6';
  btnLogin.style.background = '#d2d8d8c5';
}

// חיבור כפתורי המעבר בין התחברות/הרשמה
btnLogin.addEventListener('click', openLogin);
btnRegister.addEventListener('click', openRegister);

// עדכון סטטוס משתמש
function updateUserStatus() {
  openModalItems.forEach(item => item.style.display = 'none');

  if (userName) {
    // משתמש מחובר
    statusContainer.innerHTML = `
      <span class="logged-in-user-name">${userName}</span>
      <span class="separator">|</span>
      <a href="#" class="logout-link">התנתקות</a>
    `;

    // חיבור כפתור ההתנתקות - ישירות ללא חלונית
    const logoutLink = document.querySelector('.logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', handleLogout);
    }

  } else {
    // משתמש לא מחובר
    statusContainer.innerHTML = `
      <a href="#" class="open-login-modal">התחברות</a>
      <span class="separator">|</span>
      <a href="#" class="open-register-modal">הרשמה</a>
    `;

    const openLoginModal = document.querySelector('.open-login-modal');
    const openRegisterModal = document.querySelector('.open-register-modal');

    openLoginModal.addEventListener('click', (event) => {
      event.preventDefault();
      openLogin();
      modal.style.display = "flex";
    });

    openRegisterModal.addEventListener('click', (event) => {
      event.preventDefault();
      openRegister();
      modal.style.display = "flex";
    });
  }
}

// קריאה ראשונית לעדכון סטטוס
updateUserStatus();

function closeModalHandler() {
  modal.style.display = "none";
  resetForm('.toLogin', ".errorMsgLogin");
  resetForm('.toRegister', ".errorMsgRegister");
}

closeModalBtn.addEventListener('click', closeModalHandler);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModalHandler();
  }
});