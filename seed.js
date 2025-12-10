require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/User");

(async () => {
  try {
    await connectDB();
    const email = process.env.ADMIN_EMAIL || "ojas@bingebox.com";
    const password = process.env.ADMIN_PASSWORD || "ojas123";
    const name = "Admin";

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, password, role: "admin" });
      console.log("✅ Admin created:", email, password);
    } else {
      user.role = "admin"; await user.save();
      console.log("✅ Admin promoted:", email);
    }
    process.exit(0);
  } catch (e) {
    console.error(e); process.exit(1);
  }
})();
