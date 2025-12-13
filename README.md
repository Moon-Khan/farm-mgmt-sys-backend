# FMS Backend API

A comprehensive REST API for Farm Management System built with Node.js, TypeScript, Express, and PostgreSQL.

## 🚀 Features

- **Plot Management** - Create, read, update, delete farm plots with acreage tracking
- **Crop Management** - Manage crop lifecycle and assignments to plots
- **Caretaker Management** - Assign caretakers to plots and crops
- **Resource Management** - Track fertilizers, pesticides, irrigation, and expenses
- **Automated Reminders** - Weekly reminder generation with email notifications
- **Weather Integration** - Weather data integration for smart farming decisions
- **Authentication & Authorization** - JWT-based secure authentication
- **Cron Jobs** - Automated tasks for reminders and irrigation scheduling
- **Pagination** - Efficient data retrieval with pagination support

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (jsonwebtoken)
- **Email**: Nodemailer with SMTP
- **Cron Jobs**: node-cron
- **Validation**: Custom validation middleware
- **Security**: bcryptjs for password hashing

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── controller/      # API controllers (13 controllers)
│   ├── cron/           # Scheduled tasks
│   ├── helpers/        # Business logic services (11 services)
│   ├── middleware/     # Custom middleware (auth, validation)
│   ├── models/         # Sequelize models (11 models)
│   ├── routes/         # API routes (13 route files)
│   └── server.ts       # Server entry point
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FMS/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Configure the following variables:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=fms_db
   DB_USER=postgres
   DB_PASS=your_password
   
   # JWT
   JWT_SECRET=your_jwt_secret
   
   # Email (for reminders)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   FROM_EMAIL=your_email@gmail.com
   NOTIFY_EMAIL=notification@farm.com
   ```

4. **Database Setup**
   ```bash
   # Create database
   createdb fms_db
   
   # Run migrations (if available)
   npm run migrate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Most endpoints require JWT authentication. Include token in header:
```
Authorization: Bearer <your_jwt_token>
```

### Core Endpoints

#### Plots
- `GET /plots` - Get all plots (with pagination)
- `GET /plots/:id` - Get plot by ID
- `POST /plots` - Create new plot
- `PUT /plots/:id` - Update plot
- `DELETE /plots/:id` - Delete plot

#### Crops
- `GET /crops` - Get all crops
- `GET /crops/:id` - Get crop by ID
- `POST /crops` - Create new crop
- `PUT /crops/:id` - Update crop
- `DELETE /crops/:id` - Delete crop

#### Reminders
- `GET /reminders` - Get all reminders
- `GET /reminders/upcoming` - Get upcoming reminders (next 7 days)
- `GET /reminders/plot/:plotId` - Get reminders for specific plot
- `POST /reminders` - Create new reminder
- `PUT /reminders/:id/done` - Mark reminder as completed
- `POST /reminders/generate-weekly` - Generate weekly reminders

#### Resources
- `GET /fertilizers` - Get fertilizer applications
- `POST /fertilizers` - Apply fertilizer
- `GET /pesticides` - Get pesticide applications
- `POST /pesticides` - Apply pesticide
- `GET /irrigation` - Get irrigation records
- `POST /irrigation` - Schedule irrigation
- `GET /expenses` - Get expenses
- `POST /expenses` - Add expense

#### Caretakers
- `GET /caretakers` - Get all caretakers
- `POST /caretakers` - Add caretaker
- `POST /caretakers/assign` - Assign caretaker to plot

## 🔄 Automated Features

### Reminder System
The system automatically generates weekly reminders for active plots:

1. **Trigger**: Weekly cron job or manual API call
2. **Target**: Plots with status 'growing' or 'planting'
3. **Activities**: Creates watering, fertilizer, and spray reminders
4. **Notifications**: Sends email notifications for each reminder

### Cron Jobs
- **Every 10 minutes**: General maintenance tasks
- **Weekly**: Reminder generation (implementation pending)
- **Daily**: Irrigation scheduling (implementation pending)

## 🗄️ Database Models

### Core Models
- **Plot** - Farm plots with acreage, location, and crop assignment
- **Crop** - Crop types and lifecycle management
- **Caretaker** - Farm workers and assignments
- **Reminder** - Automated task reminders with due dates
- **Fertilizer** - Fertilizer application records
- **Pesticide** - Pesticide application records
- **Irrigation** - Irrigation scheduling and records
- **Expenses** - Financial expense tracking
- **LifecycleCrop** - Crop lifecycle stages

## 🧪 Development

### Scripts
```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Start production server
```

### Testing
```bash
npm test         # Run tests (when implemented)
```

### Code Style
- TypeScript strict mode enabled
- ES2020 target with CommonJS modules
- Sequelize models with proper typing
- Express controllers with error handling

## 🔧 Configuration

### TypeScript Configuration
- Target: ES2020
- Module: CommonJS
- Strict mode: Enabled
- Output: `dist/` directory

### Database Configuration
Located in `src/config/sequelize.ts`:
- PostgreSQL connection
- Sequelize ORM setup
- Model associations

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables Required
- Database connection details
- JWT secret
- SMTP credentials for email
- Notification email address

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Issues

For bug reports and feature requests, please use the issue tracker.

## 📞 Support

For support and questions, please contact the development team.

---

**Note**: This backend is designed to work with the FMS React frontend application. Ensure both are running for full functionality.
