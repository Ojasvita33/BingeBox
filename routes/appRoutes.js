const router = require("express").Router();
const { protect } = require("../middlewares/authMiddleware");
const movies = require("../controllers/movieController");
const user = require("../controllers/userController");
const { v4: uuid } = require("uuid");
const Movie = require("../models/Movie");

router.get("/dashboard", protect, movies.dashboard);
router.get("/movies/:id", protect, movies.getMovie);

router.get("/profile", protect, user.getProfile);
router.post("/profile/update", protect, user.updateProfile);
router.post("/profile/change-password", protect, user.changePassword);

router.get("/favorites", protect, user.getFavorites);
router.get("/favorites/add/:movieId", protect, user.addFavorite);
router.get("/favorites/remove/:movieId", protect, user.removeFavorite);

router.get("/history", protect, user.getHistory);
router.get("/history/add/:movieId", protect, user.addHistory);

router.post("/movies/:id/party", protect, async (req,res)=>{
  const m = await Movie.findById(req.params.id);
  if(!m) return res.status(404).send("Movie not found");
  const roomId = uuid();
  res.redirect(`/party/${roomId}?movie=${m._id}`);
});

module.exports = router;