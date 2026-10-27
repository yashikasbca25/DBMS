
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "movie_collection_db",
    waitForConnections: true,
    connectionLimit: 10
});

function validateMovie(data) {
    const { title, genre, release_year, rating, watched } = data;

    if (
        typeof title !== "string" ||
        !title.trim() ||
        title.trim().length > 100
    ) {
        return "Title is required and must be at most 100 characters.";
    }

    if (
        typeof genre !== "string" ||
        !genre.trim() ||
        genre.trim().length > 50
    ) {
        return "Genre is required and must be at most 50 characters.";
    }

    if (
        !Number.isInteger(Number(release_year)) ||
        Number(release_year) < 1888 ||
        Number(release_year) > 2100
    ) {
        return "Enter a release year between 1888 and 2100.";
    }

    if (
        rating !== null &&
        rating !== "" &&
        (
            !Number.isFinite(Number(rating)) ||
            Number(rating) < 0 ||
            Number(rating) > 10
        )
    ) {
        return "Rating must be between 0 and 10.";
    }

    if (!["Yes", "No"].includes(watched)) {
        return "Watched must be Yes or No.";
    }

    return null;
}

function movieValues(data) {
    return [
        data.title.trim(),
        data.genre.trim(),
        Number(data.release_year),
        data.rating === null || data.rating === ""
            ? null
            : Number(data.rating),
        data.watched
    ];
}

// VIEW AND SEARCH MOVIES
app.get("/api/movies", async (req, res) => {
    try {
        const search = String(req.query.search || "").trim();

        const [movies] = await pool.execute(
            `SELECT movie_id, title, genre, release_year, rating, watched
             FROM movies
             WHERE title LIKE ? OR genre LIKE ?
             ORDER BY movie_id DESC`,
            [`%${search}%`, `%${search}%`]
        );

        res.json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not load movies." });
    }
});

// ADD A MOVIE
app.post("/api/movies", async (req, res) => {
    const problem = validateMovie(req.body);

    if (problem) {
        return res.status(400).json({ error: problem });
    }

    try {
        const [result] = await pool.execute(
            `INSERT INTO movies
             (title, genre, release_year, rating, watched)
             VALUES (?, ?, ?, ?, ?)`,
            movieValues(req.body)
        );

        res.status(201).json({
            message: "Movie added successfully.",
            movie_id: result.insertId
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                error: "A movie with that title already exists."
            });
        }

        console.error(error);
        res.status(500).json({ error: "Could not add movie." });
    }
});

// UPDATE A MOVIE
app.put("/api/movies/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ error: "Invalid movie ID." });
    }

    const problem = validateMovie(req.body);

    if (problem) {
        return res.status(400).json({ error: problem });
    }

    try {
        const [result] = await pool.execute(
            `UPDATE movies
             SET title = ?, genre = ?, release_year = ?,
                 rating = ?, watched = ?
             WHERE movie_id = ?`,
            [...movieValues(req.body), id]
        );

        if (result.affectedRows === 0) {
            const [rows] = await pool.execute(
                "SELECT movie_id FROM movies WHERE movie_id = ?",
                [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    error: "Movie not found."
                });
            }
        }

        res.json({ message: "Movie updated successfully." });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                error: "Another movie already has that title."
            });
        }

        console.error(error);
        res.status(500).json({ error: "Could not update movie." });
    }
});

// DELETE A MOVIE
app.delete("/api/movies/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ error: "Invalid movie ID." });
    }

    try {
        const [result] = await pool.execute(
            "DELETE FROM movies WHERE movie_id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Movie not found."
            });
        }

        res.json({ message: "Movie deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not delete movie." });
    }
});

// CHECK MYSQL AND START THE SERVER
async function startServer() {
    try {
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();

        console.log("Connected to MySQL successfully.");

        app.listen(PORT, () => {
            console.log(
                `Movie Collection running at http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error("MySQL connection failed:", error.message);
        process.exit(1);
    }
}

startServer();
