import axios from "axios";

const form = document.querySelector('.toLogin');
const errorMsg = document.querySelector(".errorMsgLogin");

form.addEventListener("submit", async (event) => {
  event.preventDefault(); 
  errorMsg.textContent = ""; 
  const email = form.querySelector("#email").value;
  const password = form.querySelector("#password").value;


  if (password.length < 8) {
    errorMsg.textContent = "הסיסמה חייבת להכיל לפחות 8 תווים";
    return;
  }

  try {
    const url = `http://localhost:3000/users/login/`;
    const { data } = await axios.post(url, {
      email,
      password,
    });


    localStorage.setItem("token", data.token);
    localStorage.setItem("userName",data.username);
    location.reload();


  } catch (error) {
  if (error.response && error.response.status === 401) {
        errorMsg.textContent = "סיסמה או אימייל שגויים";
    } else {
        errorMsg.textContent = error.response?.data?.message || "אירעה שגיאה בהתחברות";
    }    console.error(error);
  }
});