require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const Movie = require("./models/Movie");
const User = require("./models/User");
const { protect } = require("./middlewares/authMiddleware");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

connectDB();

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/appRoutes"));
app.use("/", require("./routes/adminRoutes"));

app.get("/", (req, res) => {
  res.redirect("/login");       
});

// in server.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
app.get("/proxy", async (req,res)=>{
  const url = req.query.url;
  if(!url) return res.status(400).send("Missing url");
  try {
    const r = await fetch(url);
    res.set("Content-Type", r.headers.get("content-type"));
    r.body.pipe(res);
  } catch(e){
    res.status(500).send("Proxy failed");
  }
});

app.get("/party/:roomId", protect, async (req,res)=>{
  const movie = await Movie.findById(req.query.movie);
  if(!movie) return res.status(404).send("Movie not found");
  
  // Add to watch history
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { watchHistory: movie._id } });
  
  res.render("party", { roomId: req.params.roomId, movie, user: req.user });
});

io.on("connection", (socket)=>{
  socket.on("join-room", ({roomId, user})=>{
    socket.join(roomId);
    socket.to(roomId).emit("chat", {system:true, text:`${user} joined`});
  });
  socket.on("video-sync", (payload)=> socket.to(payload.roomId).emit("video-sync", payload));
  socket.on("chat", (payload)=> io.to(payload.roomId).emit("chat", payload));

  socket.on("end-party", ({ roomId, user }) => {
    io.to(roomId).emit("party-ended", { user });
    io.socketsLeave(roomId);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=>console.log("🚀 http://localhost:"+PORT));
