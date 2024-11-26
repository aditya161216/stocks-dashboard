// src/components/Login.js
import React from "react";

const Login = () => {
    const handleLogin = () => {
        // Redirect to backend's login endpoint
        window.location.href = "http://localhost:3001/auth/login";
    };

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleLogin}>Sign In with Google</button>
        </div>
    );
};

export default Login;
