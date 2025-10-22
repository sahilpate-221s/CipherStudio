# CipherStudio

A modern, full-stack web application for collaborative code editing and project management. Built with React, Node.js, Express, and MongoDB.


## Live Link[CipherStudio.com](https://cipher-studio-lemon.vercel.app/)

##Screenshot
<img width="1818" height="895" alt="image" src="https://github.com/user-attachments/assets/4deac8f6-f8d4-4bc2-948a-001490550dec" />
<img width="1660" height="881" alt="image" src="https://github.com/user-attachments/assets/210bc711-d98a-41ba-988f-30da8c1bc038" />
<img width="1741" height="893" alt="image" src="https://github.com/user-attachments/assets/ce193a71-fe59-4bed-99c4-8af0cfc02d34" />
<img width="1723" height="900" alt="image" src="https://github.com/user-attachments/assets/943b61e1-58bc-4375-acd8-1c17b0e7b38d" />







## 🚀 Features

- **Real-time Code Editing**: Monaco Editor integration for syntax highlighting and IntelliSense
- **Project Management**: Create and manage coding projects with file tree structure
- **User Authentication**: Secure login/signup with JWT tokens
- **Theme Management**: Global dark/light theme with user preferences persistence
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Sandpack Integration**: Live code preview with React components
- **File Explorer**: Interactive file tree with drag-and-drop functionality

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Monaco Editor** - Code editor with syntax highlighting
- **Sandpack** - React component playground
- **GSAP** - Animation library for smooth interactions

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

## 📁 Project Structure

```
cipher_studio/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controllers/
│   │   ├── user.controller.js    # User authentication & settings
│   │   └── project.controller.js # Project CRUD operations
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── users.models.js      # User schema
│   │   ├── project.models.js    # Project schema
│   │   └── files.models.js      # File schema
│   ├── routes/
│   │   ├── user.routes.js       # User API routes
│   │   └── project.routes.js    # Project API routes
│   ├── index.js                 # Server entry point
│   └── package.json
├── frontend/
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── home/           # Landing page components
│   │   │   ├── editor/         # Code editor components
│   │   │   └── ...             # Other components
│   │   ├── contexts/           # React contexts
│   │   │   └── ThemeContext.jsx # Global theme management
│   │   ├── hooks/              # Custom React hooks
│   │   │   └── useTheme.js     # Theme hook
│   │   ├── services/           # API services
│   │   │   └── api/            # API functions
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # App entry point
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cipher_studio
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:
   ```env
   PORT=4000
   MONGO_URL=mongodb://localhost:27017/cipherstudio
   JWT_SECRET=your-super-secret-jwt-key
   ```

   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

   Start the development server:
   ```bash
   npm run dev
   ```

4. **Access the Application**

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔐 Authentication

The application uses JWT-based authentication with HTTP-only cookies for security.

### User Registration
- POST `/api/users/register`
- Body: `{ username, email, password }`

### User Login
- POST `/api/users/login`
- Body: `{ email, password }`

### Get Profile
- GET `/api/users/profile` (Protected)
- Returns user information including settings

### Update Settings
- PUT `/api/users/settings` (Protected)
- Body: `{ settings: { theme: "dark" | "light" } }`

## 🎨 Theme Management

CipherStudio includes a comprehensive theme system that persists user preferences in the database.

### Features
- **Global Theme Context**: React Context for theme state management
- **Database Persistence**: User theme preferences saved to MongoDB
- **Real-time Updates**: Theme changes apply instantly across the app
- **Fallback Support**: LocalStorage fallback for non-authenticated users

### Usage in Components

```jsx
import { useTheme } from '../hooks/useTheme';

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <div className={theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
}
```

## 📊 API Endpoints

### User Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/users/register` | Register new user | No |
| POST | `/api/users/login` | User login | No |
| GET | `/api/users/profile` | Get user profile | Yes |
| GET | `/api/users/logout` | User logout | No |
| PUT | `/api/users/settings` | Update user settings | Yes |

### Project Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/projects` | Get all user projects | Yes |
| POST | `/api/projects` | Create new project | Yes |
| GET | `/api/projects/:projectSlug` | Get specific project | Yes |
| PUT | `/api/projects/:projectSlug` | Update project | Yes |
| DELETE | `/api/projects/:projectSlug` | Delete project | Yes |
| PUT | `/api/projects/:projectSlug/files` | Update project files | Yes |

## 🗂️ Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  settings: {
    theme: String (default: 'dark')
  },
  createdAt: Date,
  updatedAt: Date,
  lastLoggedIn: Date
}
```

### Project Model
```javascript
{
  projectSlug: String (required, unique),
  userId: ObjectId (ref: User),
  projectName: String (required),
  description: String,
  rootFolderId: ObjectId (ref: File),
  files: Mixed, // File tree structure
  settings: {
    framework: String (default: 'react'),
    autoSave: Boolean (default: true)
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 Key Components

### Frontend Components
- **LandingPage**: Marketing page with animations
- **Navbar**: Navigation with theme toggle and user menu
- **ProfilePage**: User profile management with theme settings
- **Studio**: Main coding environment with editor and preview
- **FileExplorer**: Interactive file tree component

### Backend Architecture
- **MVC Pattern**: Controllers, Models, Routes separation
- **Middleware**: Authentication and error handling
- **Validation**: Input validation and sanitization
- **Security**: Password hashing, JWT tokens, CORS

## 🔧 Development

### Available Scripts

#### Backend
```bash
npm run dev    # Start development server with nodemon
```

#### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Environment Variables

#### Backend (.env)
```
PORT=4000
MONGO_URL=mongodb://localhost:27017/cipherstudio
JWT_SECRET=your-super-secret-jwt-key
```

## 📱 Screenshots

<!-- Add screenshots here -->

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Sandpack](https://sandpack.codesandbox.io/) - Code playground

---

Built with ❤️ for developers
