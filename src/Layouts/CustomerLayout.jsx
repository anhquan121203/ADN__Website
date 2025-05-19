import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Customer/Header/Header";
import Footer from "../Components/Customer/Footer/Footer";

function CustomerLayout() {
  return (
    <>
      <div className="header ">
        <Header />
      </div>

      <div className="outlet" style={{ marginTop: 200 }}>
        <Outlet />
      </div>

      <div style={{margin: 0}}>
        <Footer />
      </div>
    </>
  );
}

export default CustomerLayout;
