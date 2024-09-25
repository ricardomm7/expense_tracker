# Expense Tracker with Firebase

This project is a web-based Expense Tracker that allows users to manage and analyze their personal expenses. Built using HTML, CSS, JavaScript, and integrated with Firebase for authentication and Firestore for data storage, it enables users to:

- **Add, Edit, and Delete Expenses**: Track expenses by entering details like description, category, date, amount, and payment method.
- **Data Visualization**: Visualize expenses through dynamic charts, including a category-wise expense distribution and payment method usage.
- **User Authentication**: Secure access with Firebase Authentication, allowing users to maintain personal records.
- **Real-time Data Updates**: Automatically updates and displays the latest data after any transaction.

This project is ideal for anyone looking to keep a detailed record of their spending habits and analyze their financial data in an organized and intuitive way.

## Getting Started with Firebase

To set up Firebase for this project, follow these steps:

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click on **Add Project**.
3. Choose a name for your project and follow the steps to create it.
4. Once the project is created, click on the **Project Overview** and proceed to create a web application.

### 2. Add Firebase to Your Web App

1. In the Firebase Console, go to **Project Settings** by clicking on the gear icon in the left-hand menu.
2. Scroll down to the **Your Apps** section and click on the **</>** (Web) icon to create a new web app.
3. Register your app by providing a nickname (e.g., `Expense Tracker App`), then click **Register app**.
4. Firebase will generate your configuration code (`firebaseConfig`). Copy this code, as you will need to paste it into your project.

   Example of Firebase SDK Config:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
     measurementId: "YOUR_MEASUREMENT_ID"
   };
    ```
5. Paste this configuration code into your project's main JavaScript file [Firebase Config](/firebase-config.js) where Firebase is initialized.

### 3. Enable Firebase Authentication

1. In the Firebase Console, go to the **Authentication** section from the left-hand menu.
2. Click on **Get Started**.
3. Under the **Sign-in Method** tab, enable **Email/Password** authentication.
4. Now, users will be able to register and log in using their email and password.

### 4. Set Up Firestore Database

1. In the Firebase Console, click on **Firestore Database** in the left-hand menu.
2. Click on **Create Database**.
3. Select **Start in production mode** to restrict access until you define security rules.
4. Choose a Cloud Firestore location and click **Enable**.

### 5. Firestore Security Rules

To ensure only authenticated users can read and write to the Firestore database, use the following Firestore security rules:

```plaintext
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
