// src/components/LoadingPage.jsx
import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../../../assets/loading/loadingAnimation.json";

const LoadingComponent = () => {
  return (
    <div style={styles.container}>
      <Lottie
        animationData={loadingAnimation}
        loop
        autoplay
        style={styles.animation}
      />
      <p style={styles.text}>Đang tải dữ liệu...</p>
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",    
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(2px)",          
    WebkitBackdropFilter: "blur(3px)",    
    zIndex: 9999,                         
  },
  
  animation: {
    width: 500,
    height: 500,
  },
  text: {
    marginTop: -20,
    fontSize: 18,
    color: "#555",
  },
};


export default LoadingComponent;
