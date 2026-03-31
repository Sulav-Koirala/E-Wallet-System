import { Navigate } from "react-router-dom";

export function getCookie(name){
    return(
        document.cookie.split("; ").find(row => row.startsWith(name + "="))?.split("=")[1]
    );
}

export default function ProtectedRoute({ children }) {
    const isAuthenticated = getCookie("isAuthenticated") === "true";

    if (!isAuthenticated) {
    return <Navigate to="/" replace />;
    }
    return children;
} 

export function getCSRF() {
    const name = 'csrftoken';
    return getCookie(name);
}