// controllers/paymentAdmin_controllers.js
const Admin = require("../models/admin_model");
const Barang = require("../models/barang_model");
const Feedback = require("../models/feedback_model");
const Payment = require("../models/payment_model");
const Transaction = require("../models/transaction_model");
const User = require("../models/user_model");
const Warehouse = require("../models/warehouse_model");

// Controller function to get all payments

// Controller function to get all payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate(
        "payment_id",
        "tanggal_pembayaran metode_pembayaran status_pembayaran jumlah_bayar"
      )
      .exec();

    res.status(200).json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching payments", error: err });
  }
};

module.exports = {
  getAllPayments,
};
