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

connectDB();

const allowedOrigins = [
  "http://localhost:3000", 
  "http://localhost:5173",
  "https://shop-nest-sysmatixx-jbqd.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("The CORS policy for this site does not allow access from the specified Origin."));
      }
    },
    credentials: true, 
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/analytics", analyticRoute);
app.use("/api", aiRoute);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is Running on Port ${PORT}`);
  });
}

module.exports = app;
