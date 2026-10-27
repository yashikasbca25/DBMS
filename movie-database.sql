CREATE DATABASE IF NOT EXISTS movie_collection_db;
USE movie_collection_db;
CREATE TABLE IF NOT EXISTS movies (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    release_year INT NOT NULL,
    rating DECIMAL(3,1),
    watched VARCHAR(3) DEFAULT 'No',
    CHECK (rating IS NULL OR rating BETWEEN 0 AND 10),
    CHECK (release_year BETWEEN 1888 AND 2100),
    CHECK (watched IN ('Yes', 'No'))
);
INSERT INTO movies
(title, genre, release_year, rating, watched)
VALUES
('The Shining', 'Horror', 1980, 8.4, 'No'),
('Interstellar', 'Sci-Fi', 2014, 8.7, 'Yes'),
('Moonlight', 'Drama', 2016, 7.4, 'No'),
('Finding Nemo', 'Animation', 2003, 8.2, 'No');
SELECT * FROM movies;
SELECT * FROM movies
WHERE genre = 'Sci-Fi';
