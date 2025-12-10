const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.render("profile", { user, error: null });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).render("profile", { user: req.user, error: "Name and email are required" });
    }
    await User.findByIdAndUpdate(req.user._id, { name, email });
    res.redirect("/profile");
  } catch (err) {
    res.status(500).render("profile", { user: req.user, error: "Failed to update profile" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).render("profile", { user: req.user, error: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).render("profile", { user: req.user, error: "Passwords do not match" });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(400).render("profile", { user: req.user, error: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });
    res.redirect("/profile");
  } catch (err) {
    res.status(500).render("profile", { user: req.user, error: "Failed to change password" });
  }
};

exports.getFavorites = async (req, res) => {
  const user = await User.findById(req.user._id).populate("favorites");
  res.render("favorites", { movies: user.favorites });
};

exports.addFavorite = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { favorites: req.params.movieId } });
  res.redirect("/favorites");
};

exports.removeFavorite = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $pull: { favorites: req.params.movieId } });
  res.redirect("/favorites");
};

exports.getHistory = async (req, res) => {
  const user = await User.findById(req.user._id).populate("watchHistory");
  res.render("history", { movies: user.watchHistory });
};

exports.addHistory = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { watchHistory: req.params.movieId } });
  res.redirect("/history");
};
