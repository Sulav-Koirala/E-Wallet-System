import { Navigate } from "react-router-dom";

export function getCookie(name){
    return(
        document.cookie.split("; ").find(row => row.startsWith(name + "="))?.split("=")[1]
    );
}

export function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(String(value))}; expires=${expires}; path=/`;
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