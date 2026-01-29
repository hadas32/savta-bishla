import axios from "axios";

const categoriesContainer = document.querySelector("#categoriesList");
const categoryImageInput = document.getElementById("categoryImage");
const categoryImagePreview = document.getElementById("categoryImagePreview");
const editModal = document.getElementById("editModal");
const closeModal = document.getElementById("closeModal");
const editCategoryName = document.getElementById("editCategoryName");
const saveEditBtn = document.getElementById("saveEdit");
const modalTitle = document.getElementById("modalTitle");
const categoryError = document.getElementById("categoryError");

let categoriesCache = [];
let isAddMode = false;
let editingCategoryId = null;

//בודק אם יש הרשאת מנהל
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
    window.location.href = "/index.html";
}

function closeAllMenus() {
    document.querySelectorAll(".category-menu").forEach(menu => menu.style.display = "none");
}

// --- פתיחת מודל הוספה/עריכה ---
function openCategoryModal(mode, category = null) {
    isAddMode = (mode === "add");
    if (isAddMode) {
        modalTitle.textContent = "הוספת קטגוריה";
        editCategoryName.value = "";
        categoryImagePreview.style.display = "none";
        categoryImageInput.value = "";
        editingCategoryId = null;
    } else {
        modalTitle.textContent = "עריכת קטגוריה";
        editCategoryName.value = category.name;
        editingCategoryId = category._id;

        if (category.image) {
            categoryImagePreview.src = `http://localhost:3000${category.image}`;
            categoryImagePreview.style.display = "block";
        } else {
            categoryImagePreview.style.display = "none";
        }
        categoryImageInput.value = "";
    }
    categoryError.style.display = "none";
    editModal.style.display = "block";
}

// --- בדיקת קיום קטגוריה בשם נתון ---
async function categoryExists(name, currentId = null) {
    return categoriesCache.some(cat => cat.name.trim() === name.trim() && cat._id !== currentId);
}

// --- בניית קטגוריה ---
function createCategoryItem(cat) {
    const div = document.createElement("div");
    div.className = "category-item";

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "categories";
    checkbox.value = cat._id;

    label.appendChild(checkbox);
    label.append(cat.name);

    const optionsBtn = document.createElement("span");
    optionsBtn.textContent = " ⋮ ";
    optionsBtn.className = "category-options";

    const menu = document.createElement("div");
    menu.className = "category-menu";
    menu.innerHTML = `
    <div class="menu-item" data-action="edit">עדכן</div>
    <div class="menu-item" data-action="delete">מחק</div>
  `;
    menu.style.display = "none";

    optionsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = menu.style.display === "block";
        closeAllMenus();
        if (!isOpen) menu.style.display = "block";
    });

    menu.querySelectorAll(".menu-item").forEach(item => {
        item.addEventListener("click", async (e) => {
            e.stopPropagation();
            const action = e.target.dataset.action;
            editingCategoryId = cat._id;

            if (action === "edit") {
                openCategoryModal("edit", cat);
            } else if (action === "delete") {
                if (confirm(`האם למחוק את הקטגוריה "${cat.name}"?`)) {
                    try {
                        await axios.delete(`http://localhost:3000/categories/${editingCategoryId}`, {
                            headers: { Authorization: "Bearer " + localStorage.getItem("token") }
                        });
                        loadCategories();
                    } catch (err) {
                        alert("שגיאה במחיקת הקטגוריה.");
                    }
                }
            }
            menu.style.display = "none";
        });
    });

    div.appendChild(label);
    div.appendChild(optionsBtn);
    div.appendChild(menu);
    return div;
}

// --- טעינת קטגוריות ---
async function loadCategories() {
    try {
        const res = await axios.get("http://localhost:3000/categories");
        categoriesCache = res.data;
        categoriesContainer.innerHTML = "";

        categoriesCache.forEach(cat => {
            const categoryItem = createCategoryItem(cat);
            categoriesContainer.appendChild(categoryItem);
        });

        const addBtn = document.createElement("div");
        addBtn.className = "category-item add-category-btn";
        addBtn.textContent = "+";
        addBtn.addEventListener("click", () => openCategoryModal("add"));
        categoriesContainer.appendChild(addBtn);
    } catch (err) {
        console.error("שגיאה בטעינת קטגוריות:", err);
    }
}

loadCategories();
document.addEventListener("click", () => closeAllMenus());
closeModal.onclick = () => editModal.style.display = "none";
window.onclick = (e) => { if (e.target === editModal) editModal.style.display = "none"; };

// --- תצוגת תמונה לקטגוריה ---
categoryImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            categoryImagePreview.src = reader.result;
            categoryImagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

// --- שמירת/עדכון קטגוריה ---
saveEditBtn.addEventListener("click", async () => {
    const name = editCategoryName.value.trim();
    if (!name) return alert("יש להזין שם קטגוריה!");


    const exists = await categoryExists(name, isAddMode ? null : editingCategoryId);
    if (exists) {
        categoryError.textContent = "קטגוריה בשם זה כבר קיימת!";
        categoryError.style.display = "block";
        setTimeout(() => categoryError.style.display = "none", 3000);
        return;
    }
    if (isAddMode && !categoryImageInput.files[0]) {
        categoryError.textContent = "חובה להעלות תמונה לקטגוריה!";
        categoryError.style.display = "block";
        setTimeout(() => categoryError.style.display = "none", 3000);
        return;
    }
    try {
        const headers = {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "multipart/form-data"
        };
        const formData = new FormData();
        formData.append("name", name);
        if (categoryImageInput.files[0]) {
            formData.append("image", categoryImageInput.files[0]);
        }

        if (isAddMode) {
            await axios.post("http://localhost:3000/categories", formData, { headers });
        } else {

            await axios.put(`http://localhost:3000/categories/${editingCategoryId}`, formData, { headers });
        }

        editModal.style.display = "none";
        loadCategories();
    } catch (err) {
        console.error("שגיאה בשמירת הקטגוריה:", err);
        alert("שגיאה בשמירת הקטגוריה.");
    }
});