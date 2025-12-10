const Movie = require("../models/Movie");

exports.dashboard = async (req, res) => {
  const q = (req.query.q || "").trim();
  const filter = q ? { $or: [{ title: { $regex: q, $options: "i" } }, { genre: { $regex: q, $options: "i" } }] } : {};
  const movies = await Movie.find(filter).sort({ createdAt: -1 });
  res.render("dashboard", { movies, q });
};

exports.getMovie = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("Movie not found");
  res.render("movie", { movie });
};
