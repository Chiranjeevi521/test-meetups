# Testing Meetups Angular App

A two-page Angular web application showcasing offline software testing meetups.

## Features

- **Page 1 (Home)**: Lists upcoming events with title, date/time, venue, and short description
- **Page 2 (Details)**: Shows full event details including description, organizer contact, and map placeholder
- **Enhanced Modern UI**: Vibrant gradient backgrounds, glass morphism effects, and colorful card designs
- **Interactive Design**: Hover effects, smooth transitions, and responsive animations
- **Color-Coded Cards**: Each event card uses different gradient themes for visual variety
- Responsive design optimized for all screen sizes
- Angular routing with smooth navigation
- Mock data service with realistic test meetup data

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

1. Start the development server:
```bash
npm start
```

2. Open your browser and navigate to `http://localhost:4200`

### Build

To build the project for production:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── event-list/          # Page 1 - Events list
│   │   └── event-detail/        # Page 2 - Event details
│   ├── models/
│   │   └── meetup.model.ts      # Data model interfaces
│   ├── services/
│   │   └── meetup.service.ts    # Mock data service
│   ├── app.component.*          # Root component
│   └── app.routes.ts            # Routing configuration
├── styles.css                   # Global styles with Tailwind
└── index.html                   # Main HTML file
```

## UI Design Features

### Visual Enhancements
- **Gradient Backgrounds**: Purple-to-blue gradient theme throughout the application
- **Glass Morphism**: Translucent cards with backdrop blur effects
- **Color-Coded Sections**: Different gradient colors for organizer info (green), event details (orange), and location (purple)
- **Interactive Elements**: Hover animations, scale effects, and smooth transitions

### Component Styles
- **Event Cards**: Glass effect cards with rotating gradient headers (purple, blue, green, orange, pink)
- **Hero Section**: Large title with glass effect elements and gradient background
- **Detail Page**: Colorful section headers with matching content backgrounds
- **Interactive Buttons**: Gradient buttons with hover scale effects

## Technologies Used

- **Angular 17** - Frontend framework with standalone components
- **Tailwind CSS** - Utility-first CSS framework with custom gradient classes
- **TypeScript** - Programming language
- **RxJS** - Reactive programming library
- **Angular Router** - Client-side routing
- **CSS3** - Advanced styling with gradients, backdrop-filter, and animations

## Mock Data

The application includes 5 sample testing meetups covering various topics:
- Test Automation with Selenium & Python
- API Testing Workshop with Postman & Newman
- Mobile Testing Strategies for iOS & Android
- Performance Testing with JMeter
- Behavior Driven Development with Cucumber

Each meetup includes comprehensive details like organizer contact information, venue details, and descriptive content suitable for demonstration purposes.