import axios from "axios";

const form = document.querySelector('.toRegister');
const errorMsg = document.querySelector(".errorMsgRegister");


form.addEventListener("submit", async (event) => {
  event.preventDefault(); 
  errorMsg.textContent = ""; 
  const username = form.querySelector("#username").value;
  const email = form.querySelector("#email").value;
  const password = form.querySelector("#password").value;
  const password2 = form.querySelector("#password2").value;


  if (password.length < 8) {
    errorMsg.textContent = "הסיסמה חייבת להכיל לפחות 8 תווים";
    return;
  }
  if (password !== password2) {
    errorMsg.textContent = "הסיסמאות לא תואמות";
    return;
  }
  try {
    const url = `http://localhost:3000/users/`;
    const { data } = await axios.post(url, {
      username,
      email,
      password,
      password2,
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("userName", data.username);
    
    location.reload();


  } catch (error) {
    errorMsg.textContent = error.response?.data?.message || "אירעה שגיאה בהתחברות";
    console.error(error);
  }
});