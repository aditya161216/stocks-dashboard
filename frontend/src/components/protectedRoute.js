import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        // check if the user is authenticated
        // 'https://stocks-dashboard-442921.ue.r.appspot.com/'
        fetch("https://stocks-dashboard-442921.ue.r.appspot.com/auth/check", {
            credentials: "include", // include cookies
        })
            .then((response) => {
                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            })
            .catch(() => setIsAuthenticated(false));
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // show a loader while checking
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />; // redirect to login if not authenticated
    }

    return children; // render the protected component if authenticated
};

export default ProtectedRoute;
