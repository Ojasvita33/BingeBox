const router = require("express").Router();
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const Movie = require("../models/Movie");

router.get("/admin", protect, adminOnly, async (req, res) => {
  const movies = await Movie.find().sort({ createdAt: -1 });
  res.render("admin", { movies, error: null, success: null });
});

router.post("/admin/movies", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, genre, releaseYear, videoUrl, posterUrl, rating } = req.body;
    await Movie.create({ title, description, genre, releaseYear, videoUrl, posterUrl, rating });
    res.redirect("/admin");
  } catch (e) {
    res.render("admin", { movies: await Movie.find(), error: "Invalid input", success: null });
  }
});

router.get("/admin/movies/:id/delete", protect, adminOnly, async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.redirect("/admin");
});

router.get("/admin/movies/:id/edit", protect, adminOnly, async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.redirect("/admin");
  res.render("edit-movie", { movie, error: null, success: null });
});

router.post("/admin/movies/:id/edit", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, genre, releaseYear, videoUrl, posterUrl, rating } = req.body;
    await Movie.findByIdAndUpdate(req.params.id, { title, description, genre, releaseYear, videoUrl, posterUrl, rating });
    res.redirect("/admin");
  } catch (e) {
    const movie = await Movie.findById(req.params.id);
    res.render("edit-movie", { movie, error: "Failed to update movie", success: null });
  }
});


module.exports = router;
