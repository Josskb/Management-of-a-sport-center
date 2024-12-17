# Management of a Sport Center

Welcome to the Management of a Sport Center project! This application helps manage a sport center, including user sign-up, login, and reservation functionalities. The frontend is built with Vue 3 and Vite, while the backend uses Node.js, Express, and SQLite.

## Table of Contents

- [Recommended IDE Setup](#recommended-ide-setup)
- [Project Setup](#project-setup)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Security Measures](#security-measures)
- [Admin User](#admin-user)
- [License](#license)

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur)

## Project Setup

### Backend Setup

1. **Navigate to the backend directory**:
   ```sh
   cd backend
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Initialize the database**:
   ```sh
   sqlite3 database.sqlite < initialize_database.sql
   ```

4. **Run the backend server**:
   ```sh
   node server.js
   ```

> Note: Ensure you have installed all the libraries listed in `server.js`:
> - express
> - body-parser
> - cors
> - bcryptjs
> - jsonwebtoken
> - express-rate-limit
> - helmet
> - cookie-parser
> - sequelize
> - dotenv

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```sh
   cd frontend
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Compile and Hot-Reload for Development**:
   ```sh
   npm run dev
   ```

4. **Compile and Minify for Production**:
   ```sh
   npm run build
   ```

5. **Lint with [ESLint](https://eslint.org/)**:
   ```sh
   npm run lint
   ```

## API Endpoints

### User Authentication

- **Sign Up**: `POST /signup`
  - Request Body:
    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string"
    }
    ```
  - Response:
    ```json
    {
      "message": "User signed up successfully"
    }
    ```

- **Log In**: `POST /login`
  - Request Body:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  - Response:
    ```json
    {
      "message": "User logged in successfully",
      "token": "string"
    }
    ```

### User Management

- **Get All Users**: `GET /users`
  - Headers:
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```
  - Response:
    ```json
    [
      {
        "id": "number",
        "username": "string",
        "email": "string",
        "password": "string"
      }
    ]
    ```

## Security Measures

- **Password Hashing**: Passwords are hashed using bcrypt before storing in the database.
- **JWT Authentication**: JSON Web Tokens (JWT) are used for user authentication.
- **Rate Limiting**: Express-rate-limit is used to limit the number of requests to the API.
- **CSRF Protection**: CSRF tokens are used to protect against cross-site request forgery attacks.
- **Secure HTTP Headers**: Helmet is used to set secure HTTP headers.

## Admin User

To try the website with admin privileges, you can use the following credentials:
- **Email**: admin@admin.fr
- **Password**: admin

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.