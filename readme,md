# 📝 Personal Task Manager

A full-stack task management web app with user authentication built using Node.js, Express, MongoDB, and vanilla JavaScript.

## 🚀 Features
- User registration & login with JWT authentication
- Create, read, update, and delete tasks
- Tasks are private — each user only sees their own
- Logout clears the JWT token

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript (Fetch API) |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Auth | JSON Web Tokens (JWT) |

## 📁 Project Structure
```
PERSONAL_TASK_MANAGER/
├── backend/
│   └── models/
│       ├── User.js
│       └── Task.js
├── frontend/
│   ├── login.html
│   ├── register.html
│   ├── tasks.html
│   ├── style.css
│   └── script.js
├── server.js
├── package.json
└── .env
```

## ⚙️ Setup & Run Locally

1. **Clone the repo**
```bash
   git clone https://github.com/Anurag-Singh2004/personal-task-manager.git
   cd personal-task-manager
```

2. **Install dependencies**
```bash
   npm install
```

3. **Create a `.env` file**
```
   JWT_SECRET=your_secret_key
   MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
```

4. **Start MongoDB** (make sure it's running locally)

5. **Run the server**
```bash
   node server.js
```

6. Open `frontend/login.html` in your browser

## 🔐 API Routes
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| POST | /register | Register a new user | Public |
| POST | /login | Login and get JWT | Public |
| GET | /tasks | Get all tasks | Private |
| POST | /tasks | Create a task | Private |
| PUT | /tasks/:id | Update a task | Private |
| DELETE | /tasks/:id | Delete a task | Private |

## 👤 Author
**Anurag Singh** — [GitHub](https://github.com/Anurag-Singh2004)