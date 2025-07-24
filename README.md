# 🏢 Apartment Management App

A **mobile-first React Native application** for managing apartment communities. This app simplifies operations for tenants, owners, employees, and administrators by using a **local database**.

---

## 📱 Tech Stack

| Feature       | Technology                     |
|--------------|----------------------------------|
| Framework     | React Native (via Expo)         |
| Language      | TypeScript                      |
| Navigation    | React Navigation                |
| Database      | TReact Native                   |
| Package Manager | npm                          |

---

## 🚀 Features

### 🧑‍💼 Admin
- Login/logout
- View all tenants and owners
- Assign parking slots
- View complaint logs
- Dashboard summary (total tenants, employees, owners)

### 🏠 Owner
- View/manage tenants
- Raise/view complaints
- View room and parking details

### 👨‍👩‍👧 Tenant
- View personal and room info
- Raise maintenance requests
- Track complaint status
- View assigned parking

### 🧹 Employee
- View all open complaints
- Track status of assigned work

---

## 🗃️ Local Database

This app uses a **local storage system** such as **react-native** for data persistence,it is a temporary storage system:

- 📴 Works offline
- ⚡ Lightweight and efficient
- 🔄 Handles local CRUD operations

---

## 🛠️ Setup Instructions

### ✅ Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Expo CLI](https://docs.expo.dev/) (Install using: `npm install -g expo-cli`)
- Android Studio or Expo Go on your phone

### 📥 Installation

```bash
git clone https://github.com/ArpitSharma4/apartment-management-app.git
cd apartment-management-app
npm install
npx expo start
