import axios from "axios";
import { setupSharedSearchBar } from "../searchBar/searchBar.js";

const recipesList = document.getElementById("recipes-list");
const urlParams = new URLSearchParams(window.location.search);
let currentPage = parseInt(urlParams.get("page")) || 1;
const limit = 8;

// פונקציה לבדוק אם המשתמש מנהל
function isAdmin() {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.role === "admin";
    } catch {
        return false;
    }
}

async function loadRecipes(page = 1) {
    try {

        //קבלת הפרמטרים לחיפוש וסינון ובקשתם מהשרת
        const params = new URLSearchParams(window.location.search);
        params.set('page', page);
        params.set('limit', limit);

        const res = await axios.get("http://localhost:3000/recipes", {
            params: Object.fromEntries(params)
        });

        const data = res.data;
        const recipes = data.recipes;
        const admin = isAdmin();

        recipesList.innerHTML = "";

        if (!recipes || recipes.length === 0) {
            recipesList.innerHTML = "<p>לא נמצאו מתכונים התואמים לחיפוש שלך</p>";
            document.getElementById("pagination").innerHTML = "";
            return;
        }

        recipes.forEach(recipe => {
            const card = document.createElement("div");
            card.classList.add("recipe-card");

            const img = document.createElement("img");
            img.src = recipe.image ? `http://localhost:3000${recipe.image}` : 'placeholder.jpg';
            img.alt = recipe.title;

            const title = document.createElement("h3");
            title.textContent = recipe.title;

            const desc = document.createElement("p");
            desc.textContent = recipe.description || "";

            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(desc);


            // כפתורים למנהל בלבד
            if (admin) {
                const buttonsDiv = document.createElement("div");
                buttonsDiv.classList.add("buttons");

                const updateBtn = document.createElement("button");
                updateBtn.classList.add("admin-btn", "update-btn");
                updateBtn.textContent = "✏ עדכון";
                updateBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    window.location.href = `/src/recipes/formRecipe/updateRecipe/updateRecipe.html?id=${recipe._id}`;
                });

                const deleteBtn = document.createElement("button");
                deleteBtn.classList.add("admin-btn", "delete-btn");
                deleteBtn.textContent = "🗑 מחיקה";
                deleteBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    deleteRecipe(recipe._id);
                });

                buttonsDiv.appendChild(updateBtn);
                buttonsDiv.appendChild(deleteBtn);
                card.appendChild(buttonsDiv);
            }

            card.addEventListener("click", () => {
                window.location.href = `/src/recipes/recipe/recipe.html?Id=${recipe._id}`;
            });

            recipesList.appendChild(card);
        });

        renderPagination(data.page, data.pages);

    } catch (err) {
        recipesList.innerHTML = "<p>שגיאה בטעינת מתכונים</p>";
        console.error("שגיאה:", err);
    }
}

async function deleteRecipe(id) {
    const token = localStorage.getItem("token");

    if (!confirm("האם את/ה בטוח/ה שברצונך למחוק את המתכון הזה?")) return;

    try {
        await axios.delete(`http://localhost:3000/recipes/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        loadRecipes(currentPage);
    } catch (error) {
        console.error("שגיאה במחיקת מתכון:", error);
    }
}

function renderPagination(current, total) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    if (current > 1) {
        const prev = document.createElement("button");
        prev.textContent = "← הקודם";
        prev.addEventListener("click", () => changePage(current - 1));
        pagination.appendChild(prev);
    }

    for (let i = 1; i <= total; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.disabled = i === current;
        btn.addEventListener("click", () => changePage(i));
        pagination.appendChild(btn);
    }

    if (current < total) {
        const next = document.createElement("button");
        next.textContent = "הבא →";
        next.addEventListener("click", () => changePage(current + 1));
        pagination.appendChild(next);
    }
}

function changePage(page) {
    currentPage = page;
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("page", page);
    window.history.pushState({ path: newUrl.href }, '', newUrl.href);
    loadRecipes(currentPage);
}

document.addEventListener("DOMContentLoaded", () => {
    setupSharedSearchBar('header', '../searchBar/searchBar.html', '../searchBar/searchBar.css');
    loadRecipes(currentPage);
});