# Expo Authentication App 🔐

A modern authentication application built with [Expo](https://expo.dev), featuring a complete authentication flow using [Appwrite](https://appwrite.io) as the backend service.

## Features

- 🔒 Complete authentication flow
  - User sign-in
  - User registration
  - Secure session management
  - Logout functionality
- 📱 Modern UI with Tailwind CSS
- 🎯 TypeScript for type safety
- 📁 Organized file structure with Expo Router
- 🔄 Context-based state management

## Project Structure

```
app/
├── (app)/                   # Protected app routes
│   ├── (drawer)/           # Drawer navigation
│   │   └── (tabs)/         # Tab navigation
│   │       └── index.tsx   # Home screen
│   └── _layout.tsx         # App layout with auth protection
├── sign-in.tsx             # Sign in screen
├── sign-up.tsx             # Sign up screen
└── _layout.tsx             # Root layout
```

## Getting Started

1. Clone the repository
   ```bash
   git clone [repository-url]
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env` file with your Appwrite credentials:
   ```env
   EXPO_PUBLIC_APPWRITE_ENDPOINT=your-endpoint
   EXPO_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
   ```

4. Start the development server
   ```bash
   npx expo start
   ```

## Technology Stack

- **Frontend Framework**: Expo/React Native
- **Styling**: Tailwind CSS (via NativeWind)
- **Navigation**: Expo Router
- **Backend**: Appwrite
- **Language**: TypeScript
- **State Management**: React Context

## Key Components

- **Authentication Context**: Manages user session state and auth operations
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Drawer Navigation**: Side menu for app navigation
- **Tab Navigation**: Bottom tabs for main app sections

## Development

To start developing:

1. Run the development server:
   ```bash
   npx expo start
   ```

2. Choose your preferred development environment:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Appwrite Documentation](https://appwrite.io/docs)
- [NativeWind Documentation](https://www.nativewind.dev/getting-started/expo-router)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)

## GitHub Issues Referenced

- https://github.com/react-navigation/react-navigation/issues/12237


## License

This project is licensed under the MIT License - see the LICENSE file for details.
