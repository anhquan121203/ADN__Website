import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";

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
