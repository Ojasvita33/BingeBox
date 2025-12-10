const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendEmail } = require("../config/email");
const crypto = require("crypto");

const issue = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

exports.getLogin = (req, res) => {
  res.render("login", { error: null, next: req.query.next || "" });
};

exports.getForgotPassword = (req, res) => {
  res.render("forgot-password", { error: null, success: null });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.render("forgot-password", { 
        error: "Email not found", 
        success: null 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    
    // Save token to user (expires in 15 minutes)
    user.resetToken = hashedToken;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    // Send email with reset link
    const resetUrl = `${req.protocol}://${req.get("host")}/reset-password/${resetToken}`;
    const message = `
      <h2>Password Reset Request</h2>
      <p>Click the button below to reset your password. This link expires in 15 minutes.</p>
      <a href="${resetUrl}" style="display:inline-block; padding:12px 24px; background:#e50914; color:white; text-decoration:none; border-radius:8px; font-weight:bold;">Reset Password</a>
      <p style="margin-top:20px; color:#888;">If you didn't request this, please ignore this email.</p>
    `;

    const emailResult = await sendEmail(
      user.email,
      "Password Reset - BingeBox",
      message
    );

    if (emailResult.success) {
      res.render("forgot-password", { 
        error: null, 
        success: "Password reset link sent to your email. Check your inbox!" 
      });
    } else {
      res.render("forgot-password", { 
        error: "Failed to send email. Please try again later.", 
        success: null 
      });
    }
  } catch (err) {
    console.error(err);
    res.render("forgot-password", { 
      error: "Something went wrong. Please try again.", 
      success: null 
    });
  }
};

exports.getRegister = (req, res) => {
  res.render("register", { error: null, next: req.query.next || "" });
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists)
      return res.render("register", { error: "Email already registered", next: req.query.next || "" });

    const user = await User.create({ name, email, password });
    const token = issue(user);
    res.cookie("token", token, { httpOnly: true });

    const redirectTo = req.query.next || "/dashboard";
    res.redirect(redirectTo);
  } catch (e) {
    console.error(e);
    res.render("register", { error: "Something went wrong", next: req.query.next || "" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.render("login", {
        error: "Invalid email or password",
        next: req.query.next || "",
      });
    }

    const token = issue(user);
    res.cookie("token", token, { httpOnly: true });

    const redirectTo = req.query.next || (user.role === "admin" ? "/admin" : "/dashboard");
    return res.redirect(redirectTo);
  } catch (e) {
    console.error(e);
    res.render("login", { error: "Something went wrong", next: req.query.next || "" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
};

exports.getResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.render("reset-password", { 
        error: "Invalid or expired reset link", 
        token: null 
      });
    }

    res.render("reset-password", { error: null, token });
  } catch (err) {
    res.render("reset-password", { error: "Something went wrong", token: null });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.render("reset-password", { 
        error: "Passwords do not match", 
        token 
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.render("reset-password", { 
        error: "Invalid or expired reset link", 
        token: null 
      });
    }

    // Update password
    user.password = password;
    user.resetToken = null;
    user.resetTokenExpire = null;
    await user.save();

    res.redirect("/login");
  } catch (err) {
    res.render("reset-password", { 
      error: "Failed to reset password. Please try again.", 
      token: req.body.token 
    });
  }
};
