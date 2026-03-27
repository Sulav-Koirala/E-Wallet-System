import { useState } from "react"
import '../styles/login.css'

export default function Login(){
    const [email,setEmail] = useState('');
    const [pwd,setPwd] = useState('');

    const changeEmail = (e) => {
        const {value} = e.target;
        setEmail(value);
    };

    const changePwd = (e) => {
        const {value} = e.target;
        setPwd(value);
    };

    return (
        <div className="container">
            <h1>Welcome back!</h1>
            <form>
            <label>Email: </label><input type="email" value={email} onChange={changeEmail} placeholder="Enter email address..."  required />
            <label>Password: </label><input type="password" value={pwd} onChange={changePwd} placeholder="Enter password..." required />
            <button type="submit">Sign In</button>
            </form>
            <p>Don't have an account? <a href='#' style={{color: '#7c3aed'}}>Sign up</a></p>
        </div>
    );
};
