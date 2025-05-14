import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// CUSTORMER PAGE
import CustomerLayout from "./Layouts/CustomerLayout";
import HomePage from "./Pages/CustomerPage/HomePage/HomePage";

// ADMIN PAGE

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
