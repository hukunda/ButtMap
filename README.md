# 🪑 ButtMap - PwC Office Seating Management System

A professional, enterprise-grade seating management application built with PwC Design System. ButtMap provides comprehensive workspace allocation tools with advanced analytics, role-based access control, and intuitive user experience.

## 🚀 Features

### Core Functionality
- **Grid-based Layout**: Mirrors Excel-like structure with numbered lines and coordinate-based seats
- **Weekly Planning**: Separate layouts for Monday through Friday
- **User Roles**: Admin and regular user permissions
- **Real-time Updates**: Instant synchronization across users
- **Special Zones**: Designated areas like "OPS team" and "Marek's office"

### Gamification
- **Points System**: Earn points for early seat selection, helping teammates, and completing challenges
- **Badges**: Unlock achievements like "Early Bird", "Desk Decorator", "Team Player", and "Social Butterfly"
- **Mini Challenges**: Complete team-based challenges like forming perfect squares or diagonal lines
- **Weekly Streaks**: Track consistent participation
- **Easter Eggs**: Discover hidden patterns for bonus rewards

### User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Animated Interface**: Smooth transitions and engaging interactions
- **Intuitive Controls**: Click-to-edit seats with modal dialogs
- **Visual Feedback**: Color-coded seat statuses and hover effects
- **Admin Controls**: Lock/unlock seats, duplicate layouts, create new weekly plans

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Navigate to the project directory**:
   ```bash
   cd buttmap
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and visit `http://localhost:3000`

## 🎮 How to Use

### First Time Setup
1. The app will automatically create a default admin user
2. Click on the user selector in the top right to switch users or add new ones
3. Add team members with appropriate user roles

### Daily Usage

#### For Regular Users:
1. **Select Your Day**: Use the daily tabs to choose which day you want to plan
2. **Choose Your Seat**: Click on any available green seat to enter your name
3. **View the Plan**: See where your colleagues will be sitting
4. **Earn Points**: Get points for early selection and consistent participation

#### For Administrators:
1. **Manage Layouts**: Create new daily layouts or duplicate from previous days
2. **Lock Seats**: Reserve specific seats by locking them
3. **Create Layouts**: Set up seating arrangements for the entire week
4. **Monitor Usage**: View statistics and help team members

### Seat Status Colors
- 🟢 **Green**: Available seats
- 🔵 **Blue**: Occupied seats  
- 🟣 **Purple**: Special zone seats
- ⚪ **Gray**: Locked seats (admin only can unlock)

### Gamification Features

#### Earning Points
- **Early Selection**: +10 points for being first to choose your seat
- **Helping Others**: +15 points for assisting teammates
- **Consistency**: +5 points for regular participation
- **Pattern Completion**: +25 points for completing team challenges

#### Badges to Unlock
- 🐦 **Early Bird**: First to choose a seat this week
- 🎨 **Desk Decorator**: Consistently sits in the same spot
- 🤝 **Team Player**: Helped organize team seating arrangements
- 🦋 **Social Butterfly**: Sat next to 5 different people this week

#### Mini Challenges
- **Perfect Square**: Arrange your team in a perfect square formation (50 points)
- **Diagonal Line**: Create a diagonal line across the office (30 points)

## 🏗️ Technical Details

### Built With
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Zustand**: Lightweight state management
- **Lucide React**: Beautiful, customizable icons

### Project Structure
```
buttmap/
├── app/
│   ├── components/          # React components
│   │   ├── SeatingGrid.tsx  # Main grid display
│   │   ├── SeatCell.tsx     # Individual seat component
│   │   ├── DailyTabs.tsx    # Weekly navigation
│   │   └── UserRoleSelector.tsx # User management
│   ├── store/               # State management
│   │   └── appStore.ts      # Zustand store
│   ├── types/               # TypeScript definitions
│   │   └── index.ts         # All type definitions
│   ├── utils/               # Utility functions
│   │   └── helpers.ts       # Helper functions
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # App layout
│   └── page.tsx             # Main page
├── public/                  # Static assets
└── package.json             # Dependencies
```

### Key Components

#### SeatingGrid
The main component that displays the office seating layout with interactive seats.

#### DailyTabs  
Allows users to switch between different days of the week and manage weekly layouts.

#### UserRoleSelector
Handles user authentication, role selection, and user management.

#### SeatCell
Individual seat component with click handlers, status indicators, and hover effects.

### State Management
The app uses Zustand for state management with local storage persistence. Key features:
- User management with roles and gamification data
- Seating layouts for each day of the week
- Real-time seat updates
- Badge and challenge tracking

## 🎨 PwC Design System Implementation

ButtMap follows **PwC's official design standards** for enterprise applications:

- **Brand Compliance**: Official PwC Orange (#FF6600) and Gray (#53565A) color palette
- **Professional Typography**: Clean, business-appropriate font hierarchy and spacing
- **Enterprise Components**: Standardized buttons, cards, inputs following PwC patterns
- **Corporate Aesthetics**: Professional shadows, layouts, and visual elements
- **Accessibility Standards**: WCAG-compliant design with proper contrast ratios
- **Responsive Framework**: Mobile-first approach optimized for all business devices

## 🔮 Future Features

- **Calendar Integration**: Sync with Outlook/Google Calendar
- **Teams Integration**: Connect with Microsoft Teams
- **Advanced Analytics**: Seating usage statistics and insights
- **Mobile App**: Native iOS and Android applications
- **Slack Bot**: Quick seat selection through Slack
- **Meeting Room Integration**: Include meeting rooms in the layout
- **Desk Booking**: Reserve desks in advance
- **Custom Layouts**: Upload custom office floor plans

## 🤝 Contributing

This is a custom application built for specific office needs. For modifications or enhancements, please work with the development team.

## 📝 License

PwC Workspace Management Solution - Built for enterprise teams worldwide.

---

**Version**: 1.0 (Enterprise)  
**Last Updated**: 2025  
**Built with**: Next.js, TypeScript, PwC Design System, Tailwind CSS  
**Design System**: PwC Official Brand Guidelines  

© 2025 PricewaterhouseCoopers. All rights reserved.

Professional workspace management. 🪑🏢