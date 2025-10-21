# CipherStudio Architecture Documentation

## High-Level Architecture

CipherStudio follows a modern full-stack architecture with clear separation of concerns:

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│                 │                  │                 │
│   React SPA     │◄────────────────►│   Express API   │
│   (Frontend)    │                  │   (Backend)     │
│                 │                  │                 │
└─────────────────┘                  └─────────────────┘
         │                                   │
         │                                   │
         ▼                                   ▼
┌─────────────────┐                  ┌─────────────────┐
│                 │                  │                 │
│   Browser       │                  │   MongoDB       │
│   LocalStorage  │                  │   Database      │
│                 │                  │                 │
└─────────────────┘                  └─────────────────┘
```

### Frontend Architecture

**Component Hierarchy:**
```
App (ThemeProvider)
├── LandingPage
├── ProtectedRoute
│   ├── ProfilePage
│   ├── ProjectsPage
│   └── Studio
│       ├── Navbar
│       ├── FileExplorerPanel
│       ├── MonacoEditor
│       └── SandpackPreview
```

**State Management:**
- **ThemeContext**: Global theme state with database persistence
- **Local Component State**: Form inputs, UI interactions
- **API State**: User authentication, project data

### Backend Architecture

**MVC Pattern:**
```
Routes → Controllers → Models
    ↑           ↑
    └──── Middleware ────┘
```

**Request Flow:**
1. **Routes**: Define API endpoints and HTTP methods
2. **Middleware**: Authentication, validation, error handling
3. **Controllers**: Business logic and data processing
4. **Models**: Database schemas and data operations

## Major Design Decisions

### 1. Theme Management with React Context

**Decision**: Used React Context instead of Redux/Zustand for simplicity

**Rationale**:
- Theme is a global concern affecting all components
- Context provides clean API without external dependencies
- Built-in React solution with excellent performance

**Benefits**:
- Lightweight implementation
- Easy to consume with custom hook
- No additional bundle size


**Implementation**:
```jsx
// Context Provider
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  // ... theme logic
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Custom Hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

### 2. Database Persistence for User Settings

**Decision**: Store theme preferences in user.settings instead of localStorage only

**Rationale**:
- Ensures theme consistency across devices and sessions
- User preferences should be portable
- Better user experience continuity

**Benefits**:
- Cross-device synchronization
- No need to reconfigure preferences on new devices
- Backup and restore capability

**Schema Design**:
```javascript
const userSchema = new mongoose.Schema({
  // ... other fields
  settings: {
    theme: { type: String, default: 'dark' },
    // Future settings can be added here
  }
});
```

### 3. JWT with HTTP-Only Cookies

**Decision**: Used HTTP-only cookies for JWT storage instead of localStorage

**Rationale**:
- Prevents XSS attacks by keeping tokens inaccessible to JavaScript
- Automatic cookie handling by browser
- Better security posture

**Benefits**:
- Enhanced security against token theft
- Automatic expiration handling
- No manual token management in frontend

**Implementation**:
```javascript
// Backend: Set HTTP-only cookie
res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
});

// Frontend: Automatic cookie inclusion
fetch('/api/users/profile', {
  credentials: 'include' // Cookies sent automatically
});
```

### 4. Monaco Editor Integration

**Decision**: Chose Monaco Editor over CodeMirror/Ace Editor

**Rationale**:
- Same editor as VS Code provides familiar UX
- Excellent TypeScript support and IntelliSense
- Rich ecosystem and active maintenance
- Performance optimized for large files

**Benefits**:
- Professional code editing experience
- Syntax highlighting for 50+ languages
- Advanced features like multi-cursor, minimap
- Accessibility features built-in

### 5. Sandpack for Code Preview

**Decision**: Integrated Sandpack for live React component preview

**Rationale**:
- Provides isolated execution environment
- Supports multiple frameworks (React, Vue, etc.)
- No server-side compilation needed
- Real-time preview updates

**Benefits**:
- Instant feedback during development
- Framework-agnostic code execution
- Secure sandboxed environment
- Easy integration with existing codebase

### 6. Tailwind CSS for Styling

**Decision**: Used Tailwind over styled-components or CSS modules

**Rationale**:
- Utility-first approach enables rapid development
- Consistent design system
- Responsive design utilities built-in
- Small bundle size with purging

**Benefits**:
- Faster development cycle
- Consistent spacing and colors
- Responsive design without custom CSS
- Tree-shaking removes unused styles

### 7. File Tree Structure in Database

**Decision**: Store file tree as JSON in MongoDB instead of separate File documents

**Rationale**:
- Simplifies queries and operations
- Maintains tree structure integrity
- Reduces database round trips
- Easier synchronization

**Benefits**:
- Faster file operations
- Atomic updates for entire project
- Simplified backup and restore
- Better performance for large projects

**Schema Design**:
```javascript
const projectSchema = new mongoose.Schema({
  // ... other fields
  files: { type: mongoose.Schema.Types.Mixed, default: {} }
  // Stores entire file tree as JSON object
});
```

