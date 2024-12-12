// routes/paymentAdmin_routes.js
const express = require("express");
const router = express.Router();
const paymentAdminController = require("../controllers_admin/paymentAdmin_controllers");

// Route to get all payments
router.get("/payments", paymentAdminController.getAllPayments);

module.exports = router;
