🏢 Apartment Management App
A mobile-first React Native application for managing apartment communities. This app simplifies operations for tenants, owners, employees, and administrators by using a local database (e.g., SQLite or Realm) — ensuring offline-first functionality.

📱 Tech Stack
Framework: React Native (via Expo)

Language: TypeScript

Navigation: React Navigation

Database: Local database (likely SQLite or Realm)

Package Manager: npm

📦 Folder Structure
📁 .expo/                # Expo config
📁 node_modules/         # Dependencies
📁 project/              # Main source code for the app
├── screens/             # App screens (Admin, Tenant, Owner, etc.)
├── components/          # Reusable UI components
├── database/            # Local DB logic (tables, queries, etc.)
├── navigation/          # Stack/tab navigators
├── utils/               # Helper functions
├── assets/              # Images/icons/fonts
🚀 Features
🧑‍💼 Admin
Login/logout

View all tenants and owners

Assign parking slots

View complaint logs

Dashboard summary (total tenants, employees, owners)

🏠 Owner
View/manage tenants

Raise/view complaints

View room and parking details

👨‍👩‍👧 Tenant
View personal details and room info

Raise maintenance requests

Track complaint status

View assigned parking

🧹 Employee
View all open complaints

Track status of assigned work

🗃️ Local Database
This app uses a local storage system (such as SQLite) for data persistence:

Works offline

Lightweight and efficient for mobile devices

CRUD operations handled locally

You’ll find database code inside the project/database/ directory.

🛠️ Setup Instructions
Prerequisites
Node.js and npm installed

Expo CLI installed (npm install -g expo-cli)

Android Studio or Expo Go on mobile

git clone https://github.com/ArpitSharma4/apartment-management-app.git
cd apartment-management-app
npm install
npx expo start
Scan the QR code with Expo Go (on Android/iOS) to run the app.


🤝 Contributors
Arpit Sharma

📄 License
This project is licensed under the MIT License.
