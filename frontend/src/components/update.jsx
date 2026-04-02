import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { getCSRF } from '../Utils'
import styles from '../styles/auth.module.css'

export default function Update(){
    const [input,setInput] = useState({
        username: '', password: '', phone_number: '', address: ''
    });
    const [error,setError] = useState('');
    const [success,setSuccess] = useState('');
    const navigate = useNavigate();

    const changeInput = (e) => {
        const {name,value} = e.target;
        setInput(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validate = () => {
        const regex = /^\+977-9\d{9}$/ ;

        if (!regex.test(input.phone_number)) {
            setError('Phone must be in format +977-9XXXXXXXXX');
            return false;
        };
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!validate()) return;
        const res = await fetch ('http://localhost:8000/ewallet/user/update/', {
            method: "PUT",
            credentials: "include",
            headers: {"Content-Type": "application/json",
                "X-CSRFToken": getCSRF()
            },
            body: JSON.stringify(input)
        });
        let data;
        try {
            data = await res.json();
        } catch {
            setError(`Server error: ${res.status} ${res.statusText}`);
            return;
        }
        if (!res.ok)  {
            setError(data.error || 'Something went wrong');
        } else {
            setSuccess(data.message + ". Login again.");
            setTimeout(() => {["isAuthenticated", "admin_user", "username", "csrftoken"].forEach(name => {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
            }); navigate("/");}, 2000);
        };
    };

    return (
        <div className={styles.body}>
        <div className={styles.container}>
            <h1 className={styles.title}>Update Profile</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <label>Username: </label><input className={styles.input} type="text" name="username" value={input.username} onChange={changeInput} placeholder="Enter new username..."  required />
                <label>Password: </label><input className={styles.input} type="password" name="password" value={input.password} onChange={changeInput} placeholder="Enter new password..." required />
                <label>Phone Number: </label><input className={styles.input} type="tel" name="phone_number" value={input.phone_number} onChange={changeInput} placeholder="Enter new phone no..." required />
                <label>Address: </label><input className={styles.input} type="text" name="address" value={input.address} onChange={changeInput} placeholder="Enter new address..." required />
                <button className={styles.button} type="submit">Update</button>
            </form>
            <p><Link to="/home" style={{color: '#7c3aed'}}>Back</Link></p>
            {error && <p style={{backgroundColor: '#fc4a4d', borderRadius: '5px', padding: '5px'}}>{error}</p>}
            {success && <p style={{backgroundColor: '#79f341', borderRadius: '5px', padding: '5px'}}>{success}</p>}
        </div>
        </div>
    );
};