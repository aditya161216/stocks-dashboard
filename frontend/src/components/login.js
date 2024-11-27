import React, { useEffect, useState } from "react";

const Login = () => {
    const [typingComplete, setTypingComplete] = useState(false);
    const welcomeText = "Welcome to the Stocks Dashboard!";
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < welcomeText.length) {
                setDisplayedText(welcomeText.slice(0, index + 1)); // Safely update displayed text
                index++;
            } else {
                clearInterval(interval);
                setTypingComplete(true);
            }
        }, 40); // Adjust typing speed here (100ms per character)
        return () => clearInterval(interval);
    }, [welcomeText]);

    const handleLogin = () => {
        // Redirect to backend's login endpoint
        window.location.href = "http://localhost:3001/auth/login";
    };

    return (
        <div className="login-container">
            <div className="content-wrapper">
                <h1 className="login-title">{displayedText}</h1>
                <p className="login-description">
                    Track your favorite stocks, visualize data trends, and make informed decisions. Sign in to start exploring!
                </p>
                {typingComplete && (
                    <button className="login-button fade-in" onClick={handleLogin}>
                        Sign In with Google
                    </button>
                )}
            </div>
        </div>
    );
};

export default Login;
