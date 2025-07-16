import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Customer/Header/Header";
import Footer from "../Components/Customer/Footer/Footer";
import LoadingComponent from "../Components/Customer/LoadingComponent/LoadingComponent";

function CustomerLayout() {
  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }, []);
  
  
    if (loading) {
      return <LoadingComponent />;
    }

  return (
    <>
      <div className="header ">
        <Header />
      </div>

      <div className="outlet" >
        <Outlet />
      </div>

      <div style={{margin: 0}}>
        <Footer />
      </div>
    </>
  );
}

export default CustomerLayout;
