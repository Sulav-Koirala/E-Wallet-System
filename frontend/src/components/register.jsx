import { useState } from "react"
import { Link,useNavigate } from 'react-router-dom'
import styles from '../styles/auth.module.css'

function CreateInput(props){
    return(
        <div className={styles.field}>
            <label>{props.label}</label>
            <input className={styles.input} type={props.type} name={props.name} value={props.value} onChange={props.onChange} placeholder={props.placeholder} required />
        </div>
    );
};

export default function Register(){
    const [details,setDetails] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        phone_number: '',
        address: ''
    });
    const [error,setError] = useState('');
    const [success,setSuccess] = useState('');

    const navigate = useNavigate()

    const changeDetails = (e) => {
        const {name, value} = e.target;
        setDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validate = () => {
        const regex = /^\+977-9\d{9}$/ ;

        if (!regex.test(details.phone_number)) {
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
        const res = await fetch('http://localhost:8000/ewallet/user/register/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(details)
        });

        let data;
        try{
            data = await res.json();
        } catch {
            setError(`Server error: ${res.status} ${res.statusText}`);
            return;
        }
        if (res.ok){
            setSuccess (data.message);
            setTimeout(() => navigate('/'), 1500);
        } else {
        setError(data.error || 'Something went wrong');
        }
    };

    return (
        <div className={styles.body}>
        <div className={styles.widecontainer}>
            <h1 className={styles.title}>Welcome New User!</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.row}>
                    <CreateInput type="text" label="First Name: " name="first_name" value={details.first_name} onChange={changeDetails} placeholder="Enter first name..." />
                    <CreateInput type="text" label="Last Name: " name="last_name" value={details.last_name} onChange={changeDetails} placeholder="Enter last name..." />
                </div>
                <div className={styles.row}>
                    <CreateInput type="text" label="Username: " name="username" value={details.username} onChange={changeDetails} placeholder="Enter username..." />
                    <CreateInput type="email" label="Email: " name="email" value={details.email} onChange={changeDetails} placeholder="Enter email address..." />
                </div>
                <div className={styles.row}>
                    <CreateInput type="password" label="Password: " name="password" value={details.password} onChange={changeDetails} placeholder="Enter password..." />
                    <CreateInput type="tel" label="Phone Number: " name="phone_number" value={details.phone_number} onChange={changeDetails} placeholder="Enter phone no..." />
                </div>
                <CreateInput type="text" label="Address: " name="address" value={details.address} onChange={changeDetails} placeholder="Enter address..." />
                <button className={styles.button} type="submit">Register</button>
            </form>
            <p>Already have an account? <Link to="/" style={{color: '#7c3aed'}}>Sign in</Link></p>
            {error && <p style={{backgroundColor: '#fc4a4d', borderRadius: '5px', padding: '5px'}}>{error}</p>}
            {success && <p style={{backgroundColor: '#79f341', borderRadius: '5px', padding: '5px'}}>{success}</p>}
        </div>
        </div>
    );
};
