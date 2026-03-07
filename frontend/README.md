# Frontend - Research Paper Submission Portal

React-based frontend application for the Research Paper Submission Portal.

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Application runs on: `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── assets/              # Static assets
│   ├── components/          # React components
│   │   ├── common/          # Reusable components
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── layout/          # Layout components
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PublicLayout.jsx
│   │   │   ├── PublicNavbar.jsx
│   │   │   └── Sidebar.jsx
│   │   └── specific/        # Feature-specific components
│   │       └── StatsCard.jsx
│   ├── context/             # React Context API
│   │   ├── AuthContext.jsx
│   │   └── PaperContext.jsx
│   ├── pages/               # Page components
│   │   ├── auth/            # Authentication pages
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── LoginRoleSelect.jsx
│   │   │   ├── Register.jsx
│   │   │   └── RegisterRoleSelect.jsx
│   │   ├── dashboard/       # Dashboard pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ReviewerDashboard.jsx
│   │   │   └── StudentDashboard.jsx
│   │   ├── papers/          # Paper management
│   │   │   ├── PaperDetails.jsx
│   │   │   └── SubmitPaper.jsx
│   │   ├── profile/         # User profile
│   │   │   └── Profile.jsx
│   │   └── public/          # Public pages
│   │       ├── About.jsx
│   │       └── Home.jsx
│   ├── services/            # API & utility services
│   │   ├── api.js           # API service with JWT
│   │   └── storageService.js
│   ├── styles/              # CSS files
│   │   ├── auth.css
│   │   ├── layout.css
│   │   └── public.css
│   ├── App.jsx              # Main app component
│   ├── Layout.jsx           # Layout wrapper
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static files
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── eslint.config.js         # ESLint configuration
└── package.json             # Dependencies

```

## 🛠️ Tech Stack

- **React** 19.2.0 - UI library
- **React Router** 7.13.0 - Client-side routing
- **Vite** 7.3.1 - Build tool and dev server
- **Lucide React** 0.564.0 - Icon library
- **Vanilla CSS** - Styling

## 🔑 Key Features

### Authentication
- JWT-based authentication
- Role-based access control
- Protected routes
- Auto-login after registration

### User Roles
- **Student** - Submit and manage papers
- **Reviewer** - Review assigned papers
- **Admin** - Full system access

### Components

#### Common Components
- **ProtectedRoute** - Route protection with role checking
- **StatusBadge** - Paper status display

#### Layout Components
- **Navbar** - Main navigation
- **Sidebar** - Dashboard navigation
- **AdminLayout** - Admin-specific layout
- **PublicLayout** - Public pages layout
- **AuthLayout** - Login/Register layout

#### Page Components
- **Home** - Landing page
- **Login/Register** - Authentication pages
- **Dashboard** - Role-specific dashboards
- **SubmitPaper** - Paper submission form
- **PaperDetails** - Paper review and details
- **Profile** - User profile management

## 🔐 Authentication Flow

1. User visits login page
2. Enters credentials
3. Frontend sends request to `/api/auth/login`
4. Backend validates and returns JWT token
5. Token stored in localStorage
6. Token included in all subsequent API requests
7. Protected routes check for valid token

## 📡 API Integration

The frontend communicates with the backend API at `http://localhost:5000/api`

### API Service (`src/services/api.js`)

All API calls include JWT token in Authorization header:
```javascript
Authorization: Bearer <token>
```

#### Available Methods:
- **Auth**: `login()`, `register()`, `logout()`, `getCurrentUser()`
- **Users**: `getUsers()`, `getUserById()`, `updateUser()`, `deleteUser()`
- **Papers**: `getPapers()`, `submitPaper()`, `updatePaper()`, `updatePaperStatus()`

## 🎨 Styling

### Design System
- Clean, professional light theme
- Consistent color palette
- Responsive design
- Modern UI components

### CSS Organization
- `index.css` - Global styles and CSS variables
- `auth.css` - Authentication pages
- `layout.css` - Layout components
- `public.css` - Public pages

## 🔄 State Management

### Context API
- **AuthContext** - User authentication state
- **PaperContext** - Paper management state

### Local Storage
- User session persistence
- Token storage
- Auto-login on page refresh

## 🚦 Routing

### Public Routes
- `/` - Home page
- `/about` - About page
- `/login` - Login page
- `/register` - Register page

### Protected Routes
- `/dashboard` - Role-specific dashboard
- `/papers/submit` - Submit paper (Student)
- `/papers/:id` - Paper details
- `/profile` - User profile

### Admin Routes
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints for tablet and desktop
- Responsive navigation
- Adaptive layouts

## 🧪 Development

### Environment Variables
Create `.env` file in frontend root:
```env
VITE_API_URL=http://localhost:5000/api
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔧 Configuration

### Vite Config (`vite.config.js`)
```javascript
export default {
  plugins: [react()],
  server: {
    port: 5173
  }
}
```

## 🐛 Troubleshooting

### Common Issues

**1. API Connection Refused**
- Ensure backend is running on port 5000
- Check CORS configuration

**2. Login Not Working**
- Clear localStorage
- Check browser console for errors
- Verify backend is running

**3. Protected Routes Not Working**
- Check if token exists in localStorage
- Verify token is valid
- Check AuthContext state

## 📝 Code Style

- Use functional components with hooks
- Follow React best practices
- Use meaningful component names
- Keep components focused and reusable
- Use CSS modules or scoped styles

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

Output will be in `dist/` directory.

### Deploy to Vercel/Netlify
1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)

## 🤝 Contributing

1. Follow the existing code style
2. Write meaningful commit messages
3. Test thoroughly before committing
4. Update documentation as needed

---

**Built with React + Vite** ⚛️
