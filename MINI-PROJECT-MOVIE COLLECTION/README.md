MOVIE COLLECTION MANAGEMENT SYSTEM

WEBSITE LINK: http://localhost:3000

 1. Introduction
The Movie Collection Management System is a web-based application developed to manage a personal collection of movies. It allows users to add, view, search, update, and delete movie details. The application uses a MySQL database to store and manage movie records.

2. Objectives
- To develop a user-friendly movie management website.
- To store movie information in a MySQL database.
- To implement Create, Read, Update, and Delete (CRUD) operations.
- To provide a search feature for finding movies by title or genre.
- To validate movie details before saving them.

3. Technologies Used
- **HTML:** Creates the structure of the website.
- **CSS:** Styles the website and makes the interface attractive.
- **JavaScript:** Handles user interactions and communicates with the backend.
- **Node.js:** Runs the server-side application.
- **Express.js:** Handles HTTP requests and API routes.
- **MySQL:** Stores movie information in database tables.
- **MySQL2:** Connects the Node.js application to MySQL.
- **dotenv:** Loads database connection settings from environment variables.

4. Database Design
**Database Name:** `movie_collection_db`
**Table Name:** `movies`
| Column Name | Data Type | Description |
|---|---|---|
| movie_id | INT | Primary key; uniquely identifies each movie |
| title | VARCHAR(100) | Stores the movie title |
| genre | VARCHAR(50) | Stores the movie genre |
| release_year | INT | Stores the release year |
| rating | DECIMAL(3,1) | Stores the movie rating from 0 to 10 |
| watched | VARCHAR(3) | Indicates whether the movie has been watched |
The `movie_id` column uses AUTO_INCREMENT to generate unique IDs automatically. The table also uses validation constraints for rating, release year, and watched status.

5. Application Features
 5.1 Add Movie (Create)
Users can enter the movie title, genre, release year, rating, and watched status using the form. The application validates the data and inserts the movie into the MySQL database.
 5.2 View Movies (Read)
The application retrieves saved movie records from MySQL and displays them in a table on the website.
 5.3 Search Movies
Users can search for movies by title or genre. The application displays matching records.
 5.4 Update Movie
Users can select the Edit button to change a movie's details. The updated information is saved to the database.
 5.5 Delete Movie
Users can delete a movie using the Delete button. The application asks for confirmation before removing the record.

 6. System Implementation
The frontend is developed using HTML, CSS, and JavaScript. The backend is developed using Node.js and Express.js. The backend provides API routes for adding, retrieving, updating, and deleting movie records.
The backend connects to MySQL using the MySQL2 library. SQL queries are executed to store and retrieve information from the `movies` table.

 7. Testing and Results
The application is tested using the following operations:
1. Adding a new movie through the website.
2. Viewing saved movies from the database.
3. Searching for movies by title or genre.
4. Updating an existing movie's details.
5. Deleting a temporary test movie.
6. Verifying the changes in MySQL Workbench.
The screenshots included with the project demonstrate the application interface, database structure, inserted records, and CRUD operations.

8. How to Run the Application
1. Install Node.js and MySQL.
2. Start the MySQL server.
3. Open the project folder in Visual Studio Code.
4. Configure the database credentials in the local `.env` file.
5. Open the VS Code terminal.
6. Install dependencies by running `npm install`.
7. Start the application by running `node server.js`.
8. Open a browser and visit `http://localhost:3000`.

9. Conclusion
The Movie Collection Management System demonstrates how a web application can interact with a MySQL database. It provides a simple interface for managing movie records and demonstrates CRUD operations, database connectivity, input validation, and search functionality.

10. Project Files
- `server.js` — Backend server and API routes.
- `public/index.html` — Website structure.
- `public/style.css` — Website styling.
- `public/script.js` — Frontend functionality.
- `movie_database.sql` — Database and table SQL script.
- `package.json` — Project information and dependencies.
- `screenshots/` — Screenshots showing the application and testing results.
