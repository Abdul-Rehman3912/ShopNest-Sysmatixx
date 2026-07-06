const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createOrder = async (req, res) => {
  try {
    const { amount, cartItems, shippingAddress, userId } = req.body;

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title || "Product Purchase",
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/ordersuccess`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      metadata: {
        userId,
        shippingAddress: JSON.stringify(shippingAddress),
      },
    });

    res.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { session_id } = req.body;

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      return res
        .status(200)
        .json({ success: true, message: "Payment verified successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
