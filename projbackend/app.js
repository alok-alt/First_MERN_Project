require('dotenv').config();
const mongoose = require('mongoose');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//My routes
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");

//Middleware
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(cors());


//My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);

//PORTS
const port = process.env.PORT || 8000;


//DB Connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=> {
    console.log("DB CONNECTED");
});  

//Starting a server
app.listen(port, () => {
     console.log(`app is running at ${port}`);
})
