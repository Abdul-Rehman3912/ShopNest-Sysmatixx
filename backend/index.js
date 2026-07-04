const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.js");
const userRoute = require("./routes/user.route.js");
const productRoute = require("./routes/product.route.js");
const paymentRoute = require("./routes/payment.route.js");
const orderRoute = require("./routes/order.route.js");
const analyticRoute = require("./routes/analytic.route.js");
const aiRoute = require("./routes/ai.route.js"); 

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/analytics", analyticRoute);
app.use("/api", aiRoute); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is Running on Port ${PORT}`);
  connectDB();
});