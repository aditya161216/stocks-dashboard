import React, { useEffect, useState } from "react";
import '../Login.css';
import { toast, ToastContainer } from "react-toastify"; // toast notifications
import "react-toastify/dist/ReactToastify.css"; // toastify CSS

const Login = () => {
    const [typingComplete, setTypingComplete] = useState(false);
    const welcomeText = "Welcome to the Stocks Dashboard!";
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {

        // this will display the text as if it is being typed
        let index = 0;
        const interval = setInterval(() => {
            if (index < welcomeText.length) {
                setDisplayedText(welcomeText.slice(0, index + 1)); 
                index++;
            } else {
                clearInterval(interval);
                setTypingComplete(true);
            }
        }, 50); // adjust typing speed 
        return () => clearInterval(interval);
    }, [welcomeText]);

    const handleLogin = () => {
        // redirect to backend's login endpoint
        // window.location.href = "http://localhost:3001/auth/login";
        window.location.href = 'https://stocks-dashboard-442921.ue.r.appspot.com/auth/login'

        // // delay the redirection to allow the toast to display
        // toast.success("Successfully logged in!", {
        //     position: "top-center",
        //     autoClose: 5000,
        // });

        // setTimeout(() => {
        //     window.location.href = "http://localhost:3001/auth/login";
        // }, 3000); // Redirect after 3 seconds
        
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
            <footer className="credits">By Aditya Vikrant</footer>
        </div>
    );
};

export default Login;
