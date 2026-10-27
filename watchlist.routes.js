import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import { addMovie, deleteMovie, findById, getWatchlist, updateMovie } from "../utils/db.js";

const router = express.Router();
router.use(authenticate);

router.get("/:userId", (req, res) => {
  const userId = Number(req.params.userId);
  if (!Number.isInteger(userId) || !findById(userId)) {
    return res.status(404).json({ error: "User not found." });
  }
  return res.status(200).json(getWatchlist(userId));
});

router.post("/:userId/movies", authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const { title, genre } = req.body ?? {};
  if (!Number.isInteger(userId) || !findById(userId)) {
    return res.status(404).json({ error: "User not found." });
  }
  if (typeof title !== "string" || !title.trim() || typeof genre !== "string" || !genre.trim()) {
    return res.status(400).json({ error: "Title and genre are required." });
  }
  return res.status(201).json(addMovie(userId, { title: title.trim(), genre: genre.trim() }));
});

router.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const movieId = Number(req.params.movieId);
  if (!Number.isInteger(userId) || !findById(userId)) {
    return res.status(404).json({ error: "User not found." });
  }
  if (!Number.isInteger(movieId) || movieId < 1) {
    return res.status(400).json({ error: "Invalid movie id." });
  }
  const { title, genre, watched } = req.body ?? {};
  const updates = {};
  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) return res.status(400).json({ error: "Title must be a non-empty string." });
    updates.title = title.trim();
  }
  if (genre !== undefined) {
    if (typeof genre !== "string" || !genre.trim()) return res.status(400).json({ error: "Genre must be a non-empty string." });
    updates.genre = genre.trim();
  }
  if (watched !== undefined) {
    if (typeof watched !== "boolean") return res.status(400).json({ error: "Watched must be a boolean." });
    updates.watched = watched;
  }
  if (!Object.keys(updates).length) return res.status(400).json({ error: "Provide at least one field to update." });

  const movie = updateMovie(userId, movieId, updates);
  if (!movie) return res.status(404).json({ error: "Movie not found." });
  return res.status(200).json(movie);
});

router.delete("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const movieId = Number(req.params.movieId);
  if (!Number.isInteger(userId) || !findById(userId)) {
    return res.status(404).json({ error: "User not found." });
  }
  if (!Number.isInteger(movieId) || movieId < 1) {
    return res.status(400).json({ error: "Invalid movie id." });
  }
  if (!deleteMovie(userId, movieId)) return res.status(404).json({ error: "Movie not found." });
  return res.status(200).json({ message: "Movie removed from watchlist." });
});

export default router;

