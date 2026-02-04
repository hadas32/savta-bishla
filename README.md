# Savta Bishla 🍲

**A Nostalgic Recipe Management & Sharing System.**

A Full Stack project offering a sleek and user-friendly digital platform for preserving, searching, and sharing family recipes. The application combines an intuitive user experience with a smart management system.

<img width="1918" height="903" alt="image" src="https://github.com/user-attachments/assets/fb705188-c87c-4458-bf78-8fa599158aaa" />

---

## ✨ Key Features

The system was developed with a focus on User Experience (UX) and personalization:

* **🔎 Advanced Search & Filtering:** A smart search engine allowing users to find recipes by name, category, and difficulty level.
* **❤️ Personal Favorites:** Registered users can manage a "Favorites" list and save their most loved dishes.
* **🛠️ Admin Panel:** An advanced dashboard enabling administrators to dynamically Add, Edit, and Delete recipes and categories (Full CRUD).
* **🔐 Security & Authentication:** Secure user authentication using **JWT** (Json Web Token) and password encryption (Bcrypt), including protection of sensitive admin routes.

---

## 🛠️ Tech Stack

Built using modern web technologies:

### Backend
* **Node.js & Express:** REST API architecture and request handling.
* **MongoDB & Mongoose:** Database for storing recipes, users, and categories.
* **JWT & Bcrypt:** Data security, login/registration processes, and authorization.

### Frontend
* **HTML5 & CSS3:** Structural layout and responsive design.
* **JavaScript (Vanilla):** Client-side logic and interactivity.
* **Axios:** Handling asynchronous HTTP requests to the server.

---
## 📸 Gallery

### Recipe Search & Catalog
<img width="1917" height="908" alt="image" src="https://github.com/user-attachments/assets/4a42ba4e-42b9-4f45-9921-7622623356fe" />

### Single Recipe Page
<img width="1916" height="899" alt="image" src="https://github.com/user-attachments/assets/6d41d47f-1725-475d-958d-ab4da6b5f0ad" />

### Admin Management Dashboard
<img width="748" height="357" alt="image" src="https://github.com/user-attachments/assets/7f9519d5-7fc0-4b92-95f4-4df0d69e80e1" />

---

## 🚀 Installation & Setup

Follow these steps to run the project locally:

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/saralev111/savta-bishla-project.git](https://github.com/saralev111/savta-bishla-project.git)
    cd savta-bishla-project
    ```

2.  **Install Dependencies (Server):**
    ```bash
    cd server
    npm install
    ```

3.  **Environment Setup (.env):**
    Create a `.env` file in the `server` directory and add the following variables:
    ```text
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/savta_bishla
    JWT_SECRET=your_secret_key
    ```

4.  **Run the Server:**
    ```bash
    npm start
    ```

5.  **Run the Client:**
    Open `client/index.html` in your browser or use the "Live Server" extension in VS Code.

---

### 👩‍💻 Created By
**Hadas Chomri & Sara Levin**
