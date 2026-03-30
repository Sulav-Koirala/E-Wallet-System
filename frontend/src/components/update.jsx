import { useState } from "react";
import { Link } from "react-router-dom";
import { getCSRF } from '../Utils'


export default function Update(){
    const [input,setInput] = useState({
        username: '', password: '', phone_number: '', address: ''
    });
    const [error,setError] = useState('');
    const [success,setSuccess] = useState('');

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
            setSuccess(data.message);
        };
    };

    return (
        <div className="container">
            <h1>Update Profile</h1>
            <form onSubmit={handleSubmit}>
                <label>Username: </label><input type="text" name="username" value={input.username} onChange={changeInput} placeholder="Enter new username..."  required />
                <label>Password: </label><input type="password" name="password" value={input.password} onChange={changeInput} placeholder="Enter new password..." required />
                <label>Phone Number: </label><input type="tel" name="phone_number" value={input.phone_number} onChange={changeInput} placeholder="Enter new phone no..." required />
                <label>Address: </label><input type="text" name="address" value={input.address} onChange={changeInput} placeholder="Enter new address..." required />
                <button type="submit">Update</button>
            </form>
            <p><Link to="/home" style={{color: '#7c3aed'}}>Back</Link></p>
            {error && <p style={{backgroundColor: '#fc4a4d', borderRadius: '5px', padding: '5px'}}>{error}</p>}
            {success && <p style={{backgroundColor: '#79f341', borderRadius: '5px', padding: '5px'}}>{success}</p>}
        </div>
    )
};