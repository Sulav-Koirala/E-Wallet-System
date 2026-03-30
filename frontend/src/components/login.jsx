import { useState,useEffect } from "react"
import '../styles/login.css'
import { Link, useNavigate } from 'react-router-dom'
import { getCookie,setCookie } from "../Utils";

export default function Login(){
    const [email,setEmail] = useState('');
    const [pwd,setPwd] = useState('');
    const [error,setError] = useState('');
    const [success,setSuccess] = useState('');

    const navigate = useNavigate();
    useEffect(() => {
    const isAuthenticated = getCookie("isAuthenticated");
    if (isAuthenticated === "true") {
      navigate("/home");}},[]);

    const changeEmail = (e) => {
        const {value} = e.target;
        setEmail(value);
    };

    const changePwd = (e) => {
        const {value} = e.target;
        setPwd(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const res = await fetch('http://localhost:8000/ewallet/user/login/', {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password: pwd })
        });

        let data;
        try {
            data = await res.json();
        } catch {
            setError(`Server error: ${res.status} ${res.statusText}`);
            return;
        }

        if (res.ok) {
            setSuccess(data.message);
            setCookie("admin_user", String(data.admin_user));
            setCookie("isAuthenticated", "true");
            setCookie("username", data.username);
            setTimeout(() => navigate('/home'), 1500);
        } else {
            setError(data.error || 'Something went wrong'); 
        }
    };

    return (
        <div className="container">
            <h1>Welcome back!</h1>
            <form onSubmit={handleSubmit}>
            <label>Email: </label><input type="email" value={email} onChange={changeEmail} placeholder="Enter email address..."  required />
            <label>Password: </label><input type="password" value={pwd} onChange={changePwd} placeholder="Enter password..." required />
            <button type="submit">Sign In</button>
            </form>
            <p>Don't have an account? <Link to="/register" style={{color: '#7c3aed'}}>Sign up</Link></p>
            {error && <p style={{backgroundColor: '#fc4a4d', borderRadius: '5px', padding: '5px'}}>{error}</p>}
            {success && <p style={{backgroundColor: '#79f341', borderRadius: '5px', padding: '5px'}}>{success}</p>}
        </div>
    );
};
