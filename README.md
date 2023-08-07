BookStore Management API
========================

The BookStore Management API is a Node.js application that allows you to manage books and users for a bookstore. It provides various endpoints to perform CRUD operations on books and user authentication.

Routes
------

### Admin Routes

#### Admin Signup

-   Route: `POST /admin/signup`
-   Description: Creates a new admin account.
-   Request Body: JSON object containing `username` and `password`.
-   Response: JSON object containing a success message and an authentication token for the admin.

#### Admin Login

-   Route: `POST /admin/login`
-   Description: Logs in an admin user with provided credentials.
-   Request Body: JSON object containing `username` and `password`.
-   Response: JSON object containing a success message and an authentication token for the admin.

#### Create Book

-   Route: `POST /admin/create`
-   Description: Creates a new book for the bookstore.
-   Authentication: Requires admin authentication using a valid admin token in the `Authorization` header.
-   Request Body: JSON object containing book details like `title`, `Description`, `price`, `rating`, and `published`.
-   Response: JSON object containing a success message and the book ID.

#### List All Books

-   Route: `GET /admin/books`
-   Description: Retrieves all books available in the bookstore.
-   Authentication: Requires admin authentication using a valid admin token in the `Authorization` header.
-   Response: JSON object containing an array of all books.

#### Update Book

-   Route: `PUT /admin/books/:bookId`
-   Description: Updates an existing book with new details.
-   Authentication: Requires admin authentication using a valid admin token in the `Authorization` header.
-   Request Parameters: `bookId` - The ID of the book to be updated.
-   Request Body: JSON object containing updated book details like `title`, `Description`, `price`, `rating`, and `published`.
-   Response: Success message if the book is updated successfully.

#### Delete Book

-   Route: `DELETE /admin/books/:bookId`
-   Description: Deletes a book from the bookstore with the specified ID.
-   Authentication: Requires admin authentication using a valid admin token in the `Authorization` header.
-   Request Parameters: `bookId` - The ID of the book to be deleted.
-   Response: Success message if the book is deleted successfully.

### User Routes

#### User Signup

-   Route: `POST /user/signup`
-   Description: Creates a new user account for the bookstore.
-   Request Body: JSON object containing `username` and `password`.
-   Response: JSON object containing a success message and an authentication token for the user.

#### User Login

-   Route: `POST /user/login`
-   Description: Logs in a user with provided credentials.
-   Request Body: JSON object containing `username` and `password`.
-   Response: JSON object containing a success message and an authentication token for the user.

#### List All Published Books

-   Route: `GET /user/books`
-   Description: Retrieves all published books available in the bookstore.
-   Authentication: Requires user authentication using a valid user token in the `Authorization` header.
-   Response: JSON object containing an array of all published books.

#### Purchase Book

-   Route: `POST /user/books/:bookId`
-   Description: Allows a user to purchase a book from the bookstore.
-   Authentication: Requires user authentication using a valid user token in the `Authorization` header.
-   Request Parameters: `bookId` - The ID of the book to be purchased.
-   Response: Success message if the book is purchased successfully.

#### List Purchased Books

-   Route: `GET /user/purchasedBooks`
-   Description: Retrieves all books purchased by the user from the bookstore.
-   Authentication: Requires user authentication using a valid user token in the `Authorization` header.
-   Response: JSON object containing an array of purchased books.

Getting Started
---------------

To use the BookStore Management API, follow these steps:

1.  Clone the repository:

`git clone <your-github-repository-url>
cd bookstore-management-api`

1.  Install the required dependencies:


`npm install`

1.  Create a `.env` file in the root directory and add the following environment variables:


`SECRET=<your-secret-key>
MONGODB_URI=<your-mongodb-connection-string>
PORT=<desired-port-number>`

Replace `<your-secret-key>` with a strong secret key used for signing JWT tokens. Also, provide your MongoDB connection string for `<your-mongodb-connection-string>`, and choose a preferred `<desired-port-number>` for running the application.

1.  Start the server:


`npm start`

The server will be running at the specified port, and you can now use the BookStore Management API endpoints using tools like Postman, curl, or integrate it into your frontend application.

Authentication
--------------

For user-specific actions, you need to obtain an authentication token by signing up or logging in as a user or admin and use that token in the `Authorization` header for protected routes. For example:

`Authorization: Bearer <your-auth-token>`

Note
----

Remember not to share sensitive information like the `.env` file or secret keys publicly or on version control systems.
