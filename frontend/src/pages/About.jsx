import React from "react";

const About = () => {
  const containerStyle = {
    maxWidth: "900px",
    margin: "0 auto",
    width: "100%",
    padding: "clamp(20px, 5vw, 40px)",
    background: "#18181b",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <img
          src="/dp.jpeg"
          alt="@Abdul Rehman"
          style={{
            width: "180px",
            maxWidth: "55vw",
            height: "auto",
            aspectRatio: "1 / 1",
            borderRadius: "50%",
            objectFit: "cover",
            border: "4px solid #f97316",
            marginBottom: "20px",
            boxShadow: "0 4px 20px rgba(249, 115, 22, 0.4)",
          }}
        />
      </div>
      <h2
        style={{
          fontSize: "clamp(2rem, 8vw, 2.5rem)",
          marginBottom: "10px",
          color: "#fff",
        }}
      >
        About Me
      </h2>
      <h3
        style={{ fontSize: "1.5rem", color: "#f97316", marginBottom: "15px" }}
      >
        Abdul Rehman
      </h3>

      <p
        style={{
          color: "#a1a1aa",
          fontSize: "clamp(1rem, 4vw, 1.2rem)",
          lineHeight: "1.8",
          maxWidth: "600px",
          margin: "0 auto 30px auto",
        }}
      >
        <strong>Join the community and grow together!</strong> Welcome to my
        platform where we build, deploy, and scale highly engineered systems.
      </p>
    </div>
  );
};

export default About;
