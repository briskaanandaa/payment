// fe/src/user/Checkout.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const Checkout = () => {
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare the data to be sent to the backend
      const paymentData = {
        amount: parseFloat(amount),
        email,
        phone,
      };

      // Send POST request to the backend to create a payment transaction
      const response = await axios.post(
        "http://localhost:3000/api/user/payment",
        paymentData
      );

      // If payment URL is provided, call Midtrans Snap API to embed the payment UI
      if (response.data.paymentUrl) {
        // Call Snap API to show the payment page on the frontend
        window.snap.pay(response.data.paymentUrl, {
          onSuccess: function (result) {
            console.log(result);
            alert("Payment Success");
            // You can send this result to the backend for saving status
          },
          onPending: function (result) {
            console.log(result);
            alert("Payment Pending");
          },
          onError: function (result) {
            console.log(result);
            alert("Payment Error");
          },
          onClose: function () {
            console.log("Payment window closed");
          },
        });
      }
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-lg font-medium">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-lg font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-lg font-medium">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md"
        >
          Pay
        </button>
      </form>
    </div>
  );
};

export default Checkout;
