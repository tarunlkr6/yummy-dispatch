<h1 align='center'>Scan & Dine</h1>

<h3>Overview</h3>
<p font-size='50px'><b>Scan & Dine</b> is a fully-functional and innovative web application built with the MERN stack. It bridges the gap between traditional dining and modern technology, offering a convenient and efficient dining experience. The platform enables customers to scan QR codes to access digital menus, book tables, and manage orders. Simultaneously, it empowers restaurant owners with an admin dashboard for streamlined operations.</p>
<div align='center'>
  <img src ='https://github.com/user-attachments/assets/0d075f0d-bb63-4f19-8b7f-2946d6afb5fb' alt='home-page'>
</div>

## Features

* **QR Code Scanning:** Scan QR codes at restaurant tables to access the menu.
* **Digital Menu:** Browse and explore restaurant menus digitally.
* **Table Booking:** Reserve tables in advance to avoid waiting times.
* **Order Management:** Place, modify, and track orders in real-time.
* **Admin Dashboard:** Manage menu items, monitor orders, and view booking statistics.

## Technologies Used

* **Frontend:** React.js with Redux Toolkit for state management.
* **Backend:** Node.js with Express.js for RESTful API development.
* **Database:** MongoDB for efficient data storage.
* **QR Code:** Integrated QR code generation and scanning libraries.
* **Authentication:** JSON Web Tokens (JWT) for secure user authentication.
<div align='center'>
  <img src="https://github.com/user-attachments/assets/e11abaf6-6bc9-4472-a51f-716993c85ec5" alt="mern-stack" height="240px">
</div>

## Demo and Screenshots
- **Live Demo**: [scan & dine live](http://scan-and-dine.onrender.com/)
- **Screenshots**

![Screenshot from 2024-12-16 06-21-39](https://github.com/user-attachments/assets/f470eb65-a76b-4ce2-abda-145acfcb1418)

![Screenshot from 2024-12-16 06-22-10](https://github.com/user-attachments/assets/6ca01840-70d0-4ddf-a2d9-f10c7e2e69fa)

![Screenshot from 2024-12-16 06-22-10](https://github.com/user-attachments/assets/b8bcdf5d-43b5-481c-b52e-60d255e438cc)

![Screenshot from 2024-12-16 06-25-15](https://github.com/user-attachments/assets/76e4d84b-9f07-4e39-b84d-d27d109d684a)


## Installation

**Prerequisites**

* Node.js (v20 or above)
* MongoDB (Local or Cloud Instance)
* npm

**Steps**

1. Clone the repository:

    ```
    git clone https://github.com/tarunlkr6/yummy-dispatch.git
    cd yummy-dispatch
    ```
2. Install Dependencies:

    * Backend:
      
     ```
     cd backend
     npm install
     ```
    * Frontend:
  
     ```
     cd frontend
     npm install
     ```
    * Admin:
      
     ```
     cd admin
     npm install
     ```
3. Set up environment variables:
   * Create a ```.env``` file in the root directory and configure the following:
   ```
   NODE_ENV = development
   
   PORT = 8080
   
   MONGO_URI = <Your mongoDB connection string>
   
   CORS_ORIGIN = *
   
   ACCESS_TOKEN_SECRET =
   ACCESS_TOKEN_EXPIRY =
   
   REFRESH_TOKEN_SECRET = 
   REFRESH_TOKEN_EXPIRY =
   
   CLOUDINARY_CLOUD_NAME = 
   CLOUDINARY_API_KEY = 
   CLOUDINARY_API_SECRET = 
   BACKEND_URL = 
   BACKEND_LOCAL_URL = 'http://localhost:8080'
   
   SERVICE_MAIL = <your gmail>
   SENDER_NAME = scan&Dine
   CLIENT_ID = <gmail api client id>
   CLIENT_SECRET = <gmail api client secret>
   REDIRECT_URI = https://developers.google.com/oauthplayground
   REFRESH_TOKEN = <oauthplaygroud refresh token string>
   PAYPAL_CLIENT_ID =
   ```
4. Run the application:
   ```
   npm run dev
   ```
5. Access the application:
   * Open your browser and navigate to http://localhost:5173
  

## Project Structure
```
yummy-dispatch/
|-- admin/
|   |-- public/
|   |-- src/
|       |-- assets/
|       |-- components/
|       |-- pages/
|       |-- App.jsx
|       |-- Main.jsx
|       |-- index.css
|-- backed/
|    |-- src/
|        |-- controllers/
|        |-- db/
|        |-- mails/
|        |-- middlewares/
|        |-- models/
|        |-- routes/
|        |-- utils/
|        |-- app.js
|        |-- constants.js
|        |-- server.js
|-- frontend/
|     |-- public/
|     |-- src/
|          |-- assets/
|          |-- components/
|          |-- configs/
|          |-- context/
|          |-- lib/
|          |-- pages/
|          |-- slices/
|          |-- App.jsx
|          |-- constants.js
|          |-- store.js
|-- package.json
|-- Readme.md
```

## Usage
 * **For Customers**: Scan the QR code placed on restaurant tables to view the menu, book tables, and place orders effortlessly.
 * **For Restaurant Owners**: Use the admin dashboard to manage menus, view customer bookings, and monitor orders.

## Future Enhancements

* **Analytics**: Provide detailed analytics for restaurant owners.
* **Mobile App**: Develop native apps for Android and iOS platforms.

## People

The author of scan & dine is <a href="https://github.com/Sukh767" target="_blank">Sukhranjan Jana</a>
  * Backend contributor
    * <a href="https://github.com/tarunlkr6" target="_blank">Tarun Kumar</a>
  * Frontend contributor
    * <a href="https://github.com/Sukh767" target="_blank">Sukhranjan Jana</a>
    * <a href="https://github.com/SoumyaT007" target="_blank">Soumya Pramanik</a>
