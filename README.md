# Project Management System (PML)

A comprehensive project management system built with Django REST Framework backend and React frontend, designed to streamline project workflows and team collaboration.

## 🚀 Features

### Admin Dashboard
- **System Overview**: Complete system administration and oversight
- **User Management**: Manage managers, team members, and system users
- **Project Oversight**: Monitor all projects across the organization
- **Help Desk Management**: Handle support requests and customer inquiries
- **Reporting**: Generate comprehensive reports and analytics

### Manager Dashboard
- **Project Creation**: Create and configure new projects
- **Team Assignment**: Assign team members to projects
- **Task Management**: Create, assign, and track tasks with priorities
- **Progress Monitoring**: Visual progress tracking with charts and metrics
- **Team Coordination**: Manage team members and their responsibilities

### Team Member Portal
- **Project View**: Access assigned projects and their details
- **Task Management**: View, update, and complete assigned tasks
- **Progress Updates**: Update task status and progress
- **Collaboration**: Communicate with team and managers

### Additional Features
- **Help & Support**: Contact form for user support and assistance
- **Authentication System**: Secure login for different user roles
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Dynamic data updates across dashboards

## 🛠️ Technology Stack

### Backend
- **Framework**: Django 5.2
- **API**: Django REST Framework
- **Database**: SQLite3 (Development)
- **Authentication**: Django Authentication System

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 7.1.2
- **Routing**: React Router DOM 6.30.1
- **HTTP Client**: Axios 1.11.0
- **Styling**: CSS3 with custom stylesheets

## 📁 Project Structure

```
pml/
├── manage.py                 # Django management script
├── start-servers.ps1         # PowerShell script to start both servers
├── db.sqlite3               # SQLite database
├── pml/                     # Django project configuration
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── pml_app/                 # Main Django application
│   ├── models.py            # Database models
│   ├── views.py             # View controllers
│   ├── api_views.py         # REST API endpoints
│   ├── serializers.py       # API serializers
│   ├── urls.py              # URL routing
│   ├── auth_views.py        # Authentication views
│   └── migrations/          # Database migrations
├── pml2/                    # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   ├── package.json        # Node.js dependencies
│   └── vite.config.js      # Vite configuration
├── templates/              # Django templates
└── static/                 # Static files
```

## 🔧 Installation & Setup

### Prerequisites
- Python 3.13+
- Node.js 16+
- npm or yarn

### Backend Setup (Django)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pml
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install django djangorestframework django-cors-headers
   ```

4. **Run database migrations**
   ```bash
   python manage.py migrate
   ```

5. **Start Django development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup (React)

1. **Navigate to React directory**
   ```bash
   cd pml2
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Start React development server**
   ```bash
   npm run dev
   ```

### Quick Start (Windows)

Use the provided PowerShell script to start both servers simultaneously:
```powershell
.\start-servers.ps1
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout

### Projects
- `GET /api/projects/` - List all projects
- `POST /api/projects/create/` - Create new project
- `GET /api/projects/<id>/` - Get project details
- `PUT /api/projects/update/<id>/` - Update project
- `DELETE /api/projects/delete/<id>/` - Delete project

### Tasks
- `GET /api/tasks/` - List all tasks
- `POST /api/tasks/create/` - Create new task
- `GET /api/tasks/<id>/` - Get task details
- `PUT /api/tasks/update/<id>/` - Update task
- `DELETE /api/tasks/delete/<id>/` - Delete task

### Team Members
- `GET /api/team-members/` - List team members
- `POST /api/team-members/create/` - Create team member
- `GET /api/team-members/<id>/` - Get team member details

### Help & Support
- `GET /api/help/` - List support requests
- `POST /api/help/create/` - Create support request

## 🎯 Usage Guide

### For Administrators
1. Login with admin credentials
2. Navigate to Admin Dashboard
3. Manage users, projects, and system settings
4. Monitor help requests and provide support

### For Managers
1. Login with manager credentials
2. Create new projects and assign team members
3. Monitor project progress and team performance
4. Create and assign tasks with priorities

### For Team Members
1. Login with team member credentials
2. View assigned projects and tasks
3. Update task progress and status
4. Collaborate with team members and managers

## 🔒 Security Features

- **Authentication**: Session-based authentication for secure access
- **Authorization**: Role-based access control (Admin, Manager, Team Member)
- **CSRF Protection**: Built-in Django CSRF protection
- **Input Validation**: Server-side and client-side form validation
- **XSS Prevention**: React's built-in XSS protection

## 🚀 Deployment

### Backend Deployment
1. Configure production settings in `settings.py`
2. Set up production database (PostgreSQL recommended)
3. Configure static files serving
4. Use WSGI server like Gunicorn

### Frontend Deployment
1. Build the React application:
   ```bash
   npm run build
   ```
2. Serve static files using nginx or similar web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Development Guidelines

### Code Style
- **Python**: Follow PEP 8 guidelines
- **JavaScript**: Use ESLint configuration provided
- **Git**: Use conventional commit messages

### Testing
```bash
# Django tests
python manage.py test

# React tests
npm test
```

## 📈 Future Enhancements

- [ ] Real-time notifications
- [ ] File upload and document management
- [ ] Advanced reporting and analytics
- [ ] Mobile application
- [ ] Integration with third-party tools (Slack, Jira, etc.)
- [ ] Email notifications for task assignments
- [ ] Calendar integration
- [ ] Time tracking functionality

## 📞 Support

For support requests:
1. Use the built-in Help page within the application
2. Contact the development team
3. Create an issue in the repository

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Django and React communities
- Contributors and testers
- Project stakeholders

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Developed by**: Rajvardhan Chavan