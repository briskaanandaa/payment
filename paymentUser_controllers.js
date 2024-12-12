// controllers_user/paymentUser_controllers.js
const mongoose = require("mongoose");
const midtransClient = require("midtrans-client");
const Payment = require("../models/payment_model"); // Pastikan model sudah benar

// Inisialisasi Midtrans Snap API
const snap = new midtransClient.Snap({
  isProduction: false, // Ubah menjadi true di lingkungan produksi
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

exports.createPayment = async (req, res) => {
  const { amount, email, phone } = req.body;

  // Validasi input
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid payment amount" });
  }

  try {
    // Membuat detail transaksi Midtrans
    const transactionDetails = {
      transaction_details: {
        order_id: `order-${new Date().getTime()}`, // ID unik untuk setiap transaksi
        gross_amount: amount, // Jumlah pembayaran
      },
      credit_card: {
        secure: true, // Aktifkan secure mode
      },
      customer_details: {
        email: email || "customer@example.com",
        phone: phone || "081234567890",
      },
    };

    // Kirim request transaksi ke Midtrans
    const transaction = await snap.createTransaction(transactionDetails);

    // Simpan data pembayaran ke database
    const payment = new Payment({
      payment_id: transaction.token, // Token transaksi dari Midtrans
      transaction_id: new mongoose.Types.ObjectId(), // Properti ObjectId harus dibuat menggunakan `new`
      jumlah_bayar: amount,
      tanggal_pembayaran: new Date(),
      metode_pembayaran: "credit", // Harus salah satu dari ['cash', 'credit']
      status_pembayaran: "pending", // Status awal
    });

    await payment.save(); // Simpan data pembayaran ke DB

    // Kirim URL pembayaran
    res.json({
      paymentUrl: transaction.redirect_url, // URL untuk pembayaran
      message: "Transaction created successfully",
    });
  } catch (error) {
    console.error("Error during payment initiation:", error.message);
    res.status(500).json({
      message: "Payment initiation failed",
      error: error.message,
    });
  }
};
