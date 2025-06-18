# ClientesPro App

ClientesPro is a comprehensive mobile application designed to help businesses manage their clients effectively. It features a user-friendly interface for client data management, appointment scheduling, and communication. The backend provides a robust API to support these functionalities.

## ✨ Features

- Client Management: Add, view, edit, and delete client information.
- Appointment Scheduling: (If applicable, describe this feature)
- User Authentication: Secure login and registration for users.
- Data Synchronization: (If applicable, describe how data syncs between mobile and backend)
- Reporting: (If applicable, describe any reporting or analytics features)

*(Please review and update this list with the actual features of your application.)*

## 🛠️ Technologies Used

### Frontend
- **React Native:** [![React Native](https://img.shields.io/badge/React%20Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
- **Expo:** [![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
- **React Navigation:** [![React Navigation](https://img.shields.io/badge/React%20Navigation-6B52AE?style=for-the-badge)](https://reactnavigation.org/)
- **Redux Toolkit:** [![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
- **Axios:** [![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)

### Backend
- **Node.js:** [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
- **Express.js:** [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
- **MongoDB:** [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/) (Inferred from Mongoose)
- **JWT (JSON Web Tokens):** [![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

## 📱 Frontend Setup (React Native with Expo)

To set up and run the frontend of the ClientesPro application, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url> # Replace <repository-url> with the actual URL
    cd <repository-directory-name> # Replace <repository-directory-name> with the name of the cloned folder
    ```

2.  **Navigate to the project root directory** (if you're not already there after cloning).

3.  **Install dependencies:**
    This command will install all the necessary packages defined in `package.json`.
    ```bash
    npm install
    ```

4.  **Run the application:**
    This command starts the Metro Bundler, which allows you to run the app on a simulator/emulator or on a physical device using the Expo Go app.
    ```bash
    npm start
    ```
    After running this, you will see a QR code in your terminal.
    - **On a physical device:** Install the Expo Go app (available for iOS and Android) and scan the QR code.
    - **On a simulator/emulator:**
        - Press `i` to open in an iOS simulator.
        - Press `a` to open in an Android emulator/simulator.
        - Press `w` to open in a web browser.

Make sure you have Node.js and npm installed on your system. If you plan to use iOS or Android simulators, ensure you have Xcode (for iOS) or Android Studio (for Android) set up.

## ⚙️ Backend Setup (Node.js with Express)

To set up and run the backend API for the ClientesPro application, follow these steps:

1.  **Clone the repository** (if you haven't already for the frontend):
    ```bash
    git clone <repository-url> # Replace <repository-url> with the actual URL
    cd <repository-directory-name>/clientespro-backend # Navigate into the backend directory
    ```
    If you've already cloned the repository for the frontend, simply navigate to the `clientespro-backend` directory from the project root:
    ```bash
    cd clientespro-backend
    ```

2.  **Install dependencies:**
    This command will install all the necessary packages defined in `clientespro-backend/package.json`.
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    The backend requires certain environment variables to function correctly. Create a `.env` file in the `clientespro-backend` directory. You can usually copy an existing `.env.example` file if available, or create one from scratch.

    Here are common variables you'll likely need:
    ```env
    PORT=5000 # Or any port you prefer
    MONGODB_URI=your_mongodb_connection_string # Replace with your MongoDB connection string
    JWT_SECRET=your_very_strong_jwt_secret # Replace with a strong, unique secret for JWT
    NODE_ENV=development
    ```
    **Important:**
    - Replace `your_mongodb_connection_string` with your actual MongoDB Atlas or local MongoDB instance connection string.
    - Replace `your_very_strong_jwt_secret` with a secure random string.

4.  **Run the backend server:**
    To start the server in development mode (which typically uses `nodemon` for automatic restarts on file changes):
    ```bash
    npm run dev
    ```
    Or, to run it in production mode:
    ```bash
    npm start
    ```
    You should see a message in the console indicating that the server is running, e.g., `🚀 Servidor corriendo en puerto 5000 en modo development`.

Make sure you have Node.js and npm installed. You'll also need a MongoDB database accessible to the backend.

## 🚀 Deployment

### Frontend (React Native with Expo)

There are several ways to deploy or share your Expo application:

1.  **Expo Go (Development and Sharing):**
    - As described in the "Frontend Setup", you can run the app locally using `npm start` and then open it on your phone using the Expo Go app by scanning the QR code. This is great for development and sharing with a few people.

2.  **Expo Application Services (EAS) Build (Standalone Apps):**
    - For creating standalone app binaries (`.ipa` for iOS, `.apk` or `.aab` for Android) that can be submitted to app stores or distributed directly, Expo offers EAS Build.
    - You'll need to install the EAS CLI: `npm install -g eas-cli`
    - Log in to your Expo account: `eas login`
    - Configure your project for EAS Build if you haven't already: `eas build:configure`
    - Start a build:
        ```bash
        eas build -p android
        # or
        eas build -p ios
        # or
        eas build -p all
        ```
    - Follow the prompts. EAS will build your app in the cloud. For more details, refer to the [official EAS Build documentation](https://docs.expo.dev/build/introduction/).

3.  **Web Build:**
    - You can create a static web build of your app:
        ```bash
        npx expo export -p web
        ```
    - This will create a `web-build` directory that you can deploy to any static web hosting service (like Netlify, Vercel, GitHub Pages).

### Backend (Node.js with Express)

1.  **Running Locally:**
    - As described in the "Backend Setup", you can run the backend server locally using `npm start` or `npm run dev`. This is suitable for development or very small-scale use where the machine running the server is accessible to the frontend.

2.  **Cloud Platform Deployment:**
    - For production, you'll typically deploy the Node.js backend to a cloud platform. Popular choices include:
        - **Heroku:** Known for its ease of use for deploying Node.js apps.
        - **AWS (Amazon Web Services):** Options like EC2, Elastic Beanstalk, or Lambda.
        - **Google Cloud Platform (GCP):** Options like App Engine, Cloud Run, or Compute Engine.
        - **Microsoft Azure:** Options like App Service or Virtual Machines.
        - **DigitalOcean:** Offers Droplets (virtual machines).
    - The general process involves:
        - Pushing your code to a Git repository (like GitHub).
        - Connecting your chosen cloud platform to the repository.
        - Configuring environment variables (like `MONGODB_URI`, `JWT_SECRET`, `PORT`, `NODE_ENV=production`) directly on the cloud platform's dashboard or through their CLI.
        - Setting up a process manager (like PM2) if deploying to a VM to keep your app running.
    - Each platform has its own specific deployment guides, so refer to their official documentation. For example, to deploy to Heroku, you'd typically need a `Procfile` (e.g., `web: npm start`) and set environment variables via the Heroku dashboard or CLI.

Remember to secure your API keys and sensitive data by using environment variables and not hardcoding them into your application.

## 📸 App Screenshot

![image](https://github.com/user-attachments/assets/2170d6e0-8cc1-4601-97d0-9c36ee22ae5d)  ![image](https://github.com/user-attachments/assets/f706baad-e4d5-46a3-b771-928b6dc9db61)


