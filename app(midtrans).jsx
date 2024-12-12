// fe/src/App.js or wherever you set up routing
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Checkout from "./user/Checkout";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/checkout" element={<Checkout />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
};

export default App;
