# Blog App


## 📱 About

This is a full-featured blog application built using the **MERN Stack** with an additional **mobile application developed using React Native (Expo)**.

  The project now consists of:  
- 🌐 **Web App** (React + Vite)  
- 📱 **Mobile App** (React Native + Expo)  
- 🖥️ **Backend API** (Node.js + Express)  
- 🗄️ **Database** (MongoDB)
  
Users can:  
- Register and log in  
- Create, edit, and delete blog posts  
- Follow other users  
- Like and comment on posts  
- Bookmark posts  
- Explore community content  
- Use the app on both **web and mobile platforms**

## 🧩 Tech Stack  
  
### Frontend (Web)  
- React (Vite)  
- Redux & Redux Toolkit  
- Redux Persist  
- Axios  
- React Router DOM  
- Formik  
- Bootstrap  
- React Icons  
- JWT Decode  
  
### Mobile (React Native)  
- React Native (Expo)  
- React Navigation  
- Redux Toolkit  
- Axios  
- Custom Hooks & Components  
  
### Backend  
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JWT Authentication  
  
### Backend Dependencies  
- bcrypt  
- body-parser  
- cors  
- dotenv  
- express-async-handler  
- jsonwebtoken  
- mongoose  
- multer  
  

## Database Design

![db](https://github.com/user-attachments/assets/c70dd09b-00ac-4961-b9bd-672e411237ed)  
  

## Installation and startup


After cloning the project and importing the database, install dependencies and run each part:  
  
### 1️⃣ Web Client  
```bash  
cd client  
npm install  
npm run dev
```  
### 2️⃣ Mobile App (Expo)  
```bash  
cd mobile
npm install
npx expo start
```  
### 3️⃣ Backend Server  
```bash  
cd server
npm install  
npm run dev
```  


## 🎬 Demo(Mobile)
https://github-production-user-asset-6210df.s3.amazonaws.com/61507892/570558803-06a8d0df-170b-4ecd-812a-52a8e6fc3598.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20260327%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260327T175643Z&X-Amz-Expires=300&X-Amz-Signature=1b092f0bd0a1e28bb1152a4ea6d9ca716a939be4bafd0faf4bf4dd6cc3738c13&X-Amz-SignedHeaders=host
  

## 🎬 Demo(Web)
https://github-production-user-asset-6210df.s3.amazonaws.com/61507892/570565000-554b9b82-a7b3-4340-aa38-2a7ab511cfc0.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20260327%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260327T180048Z&X-Amz-Expires=300&X-Amz-Signature=53998803614abffa62ce863d88d06ae7b25c24c168b61e992441e979fbc86eeb&X-Amz-SignedHeaders=host
  
## ✨ Features

### 🌐 Web

-   Responsive UI
-   Authentication system
-   Blog creation & interaction
-   Profile management
-   Bookmark system

### 📱 Mobile

-   Native-like experience with Expo
-   Pull-to-refresh
-   Optimized UI components
-   Persistent login state
-   Profile image in TabBar
-   "New" badge for fresh posts  
  
## 📸 Screenshots(Mobile)
<img src="https://github.com/user-attachments/assets/832cd06c-11e8-40b0-9d1d-34b548e60f59" alt="Demo Image" width="400" />
<img src="https://github.com/user-attachments/assets/92ccca82-7f4c-4742-a378-85674898bd5c" alt="Demo Image" width="400" />
<img src="https://github.com/user-attachments/assets/3a0b162d-3319-4c53-aafa-150a1d9c6199" alt="Demo Image" width="400" />
<img src="https://github.com/user-attachments/assets/c35a3437-4c5e-4532-aac3-de3b145b4f0d" alt="Demo Image" width="400" />
<img src="https://github.com/user-attachments/assets/397cc4df-9126-4c91-8763-224ba27437ed" alt="Demo Image" width="400" />
<img src="https://github.com/user-attachments/assets/7d31f2bc-9917-4626-ba20-f0890333e3dd" alt="Demo Image" width="400" />
<img src="https://github.com/user-attachments/assets/bd38a8b7-5125-4d6e-aff3-3f22b7b79db5" alt="Demo Image" width="400" />
<img src="https://github.com/user-attachments/assets/2886080a-5167-47bb-8bff-5408ff27855a" alt="Demo Image" width="400" />

## 📸 Screenshots(Web)

![ss1](https://github.com/user-attachments/assets/494bc084-d477-4e76-ae81-39de3ae06048)

![ss2](https://github.com/user-attachments/assets/a3607098-56a3-444f-9f39-fbc8ab996b62)

![ss3](https://github.com/user-attachments/assets/bd8fd2c1-36bf-412b-995e-d14f2b3adf45)

![ss4](https://github.com/user-attachments/assets/f2eb96ab-dd00-45d1-9cf9-b522c9ed2ce8)

![ss5](https://github.com/user-attachments/assets/89a7e1df-576b-4998-805b-e709a2d3cad8)

![ss6](https://github.com/user-attachments/assets/abac42e4-3366-4aed-8bcd-c64d5e0ddfae)

![ss7](https://github.com/user-attachments/assets/2019850c-68c9-4133-a211-64d40dab390a)

![ss8](https://github.com/user-attachments/assets/249a175d-209a-42eb-9820-8882289880a1)

## 📌 Notes

-   Make sure MongoDB is running locally or provide a cloud connection string
-   For mobile testing, use **Expo Go** or an emulator
-   Configure environment variables in the `.env` file