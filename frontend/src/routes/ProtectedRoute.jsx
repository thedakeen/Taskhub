import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

function ProtectedRoute({ user, children, setError }) {
    const location = useLocation();

    useEffect(() => {
        if (!user) {
            setError(401);
        }
    }, [user, setError]);

    if (!user) {
        return <Navigate to="/signin" replace state={{ from: location }} />;
    }

    return children;
}

export default ProtectedRoute;
