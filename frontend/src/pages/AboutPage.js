import React from 'react';
import './StaticPage.css';

const AboutPage = () => {
  return (
    <div className="static-page-container">
      <div className="static-page-content">
        <h1>About SafarGuardia</h1> {/* Updated name */}
        <p className="lead">
          Our mission is to create a safer, more secure travel experience for women on Mumbai's local train network, especially during late hours.
        </p>
        <p>
          SafarGuardia is an initiative for the Smart India Hackathon, born from a desire to use technology to address real-world safety concerns. We believe that by providing data-driven insights and immediate access to safety tools, we can empower women to travel with greater confidence and peace of mind.
        </p>

        <h2>Our Approach</h2>
        <p>
          SafarGuardia combines community-sourced feedback with predictive machine learning models to create a comprehensive safety ecosystem. From predicting station safety levels to providing tools like an emergency SOS and a Fake Call feature, our goal is to offer a multi-layered safety net for every female commuter.
        </p>

        <h2>The Team</h2>
        <p>
          We are a team of passionate B.Tech students specializing in Cyber Security and AI, dedicated to building innovative solutions for a better, safer India.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;