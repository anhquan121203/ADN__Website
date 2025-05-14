import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header/Header";

function CustomerLayout() {
  return (
    <>
      <div className="header ">
        <Header />
      </div>

      <div className="outlet" style={{ marginLeft: 100, marginRight: 100, marginTop: 150,  backgroundColor: "#f5f5f5" }}>
        <Outlet />
      </div>

      {/* <div style={{margin: 0}}>
        <Footer />
      </div> */}
    </>
  );
}

export default CustomerLayout;
