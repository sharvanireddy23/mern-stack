const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require('express')
const cors = require('cors');
const fileupload = require("express-fileupload")
const cookieParser = require("cookie-parser")

const app = express()

app.use(cors({
  origin: '*',
  credentials: true,
}));
// const port = 3000
const httpServer = createServer(app);
global.io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});


const apiRoutes = require("./routes/apiRoutes")

//this is used to recognize json data
app.use(express.json())
app.use(cookieParser())
app.use(fileupload())

const admins = [];
let activeChats = [];
function get_random(array) {
  return array[Math.floor(Math.random() * array.length)]
}

io.on("connection", (socket) => {
  // console.log("A user connected");
  socket.on("admin connected with server", (adminName) => {
    admins.push({ id: socket.id, admin: adminName })
    // console.log(admins)
  })
  socket.on("client sends message", (msg) => {
    // console.log( msg);
    if (admins.length === 0) {
      socket.emit("no admin", "")
    } else {
      let client = activeChats.find((client) => client.clientId === socket.id);
      let targetAdminId;
      if (client) {
        targetAdminId = client.adminId;
      } else {
        let admin = get_random(admins)
        activeChats.push({ clientId: socket.id, adminId: admin.id });
        targetAdminId = admin.id
      }
      socket.broadcast.to(targetAdminId).emit("server sends message from client to admin", {
        user: socket.id,
        message: msg,
      })
    }
  })
  socket.on("admin sends message", ({ user, message }) => {
    socket.broadcast.to(user).emit("server sends message from admin to client", message)
  });

  socket.on("admin closes chat", (socketId) => {
    socket.broadcast.to(socketId).emit("admin closed chat", "");
    let c = io.sockets.sockets.get(socketId);
    c.disconnect();
  })


  socket.on("disconnect", (reason) => {
    const removeIndex = admins.findIndex((item) => item.id === socket.id);
    if (removeIndex !== -1) {
      admins.splice(removeIndex, 1)
    }
    activeChats = activeChats.filter((item) => item.adminId !== socket.id);

    //client disconnect
    const removeIndexClient = activeChats.findIndex((item) => item.clientId === socket.id);
    if (removeIndexClient !== -1) {
      activeChats.splice(removeIndexClient, 1)
    }
    socket.broadcast.emit("disconnected", { reason: reason, socketId: socket.id });
  })
});


app.get('/', async (req, res, next) => {
  // const Product = require("./models/productModel")
  // try{
  //     const product = new Product
  //     product.name = "New product name"
  //     const productSaved = await product.save()
  //     console.log(productSaved === product)
  //     const products = await Product.find()
  //     console.log(products.length)
  //     res.send("Product created" + product._id)
  // }catch(error){
  //     next(error)
  // }
  res.json({ message: "API running..." })
})

//mongoDB connection
const connectDB = require("./config/db")
connectDB();


app.use('/api', apiRoutes)

app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }
  next(error)
})
app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    res.status(500).json({
      message: error.message,
      stack: error.stack
    })

  } else {
    res.status(500).json({
      message: error.message
    })
  }
})

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })
