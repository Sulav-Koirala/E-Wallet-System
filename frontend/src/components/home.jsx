import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCookie,getCSRF } from '../Utils'

export default function Home(){
    const username = getCookie("username");
    const navigate = useNavigate();
    const [error,setError] = useState('');
    const [profile,setProfile] = useState(null);

    const handlelogout = async () => {
        setError('');
        const res = await fetch ('http://localhost:8000/ewallet/user/logout/', {
            method: "POST",
            credentials: "include",
            headers: {'Content-Type': 'application/json',
                'X-CSRFToken': getCSRF()
            },
        });
        let data;
        try {
            data = await res.json();
            console.log(data);
        } catch {
            setError(`Server error: ${res.status} ${res.statusText}`);
            return;
        }
        if (res.ok) {
            ["isAuthenticated", "admin_user", "username", "csrftoken"].forEach(name => {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
            });
            navigate("/");
        } else {
            setError(data.error || 'Something went wrong');
        };
    };

    const handleProfile = async () => {
        setError('');
        const res = await fetch ('http://localhost:8000/ewallet/user/profile/', {
            method: "GET",
            credentials: "include",
            headers: {"Content-Type": "application/json"}
        });
        let data;
        try{
            data = await res.json();
        } catch {
            setError(`Server error: ${res.status} ${res.statusText}`);
            return;
        }
        if (!res.ok)  {
            setError(data.error || 'Something went wrong');
        } else {
            setProfile(data);
        };
    };

    const handleUpdate = () => {
        navigate("/update");
    };

    const handleWallet = () => {
        navigate("/wallet");
    };
    
    return(
        <>
            <p>Welcome, {username}</p>
            <button onClick={handlelogout}>Log Out</button>
            {profile === null ? (
            <>
                <p>Services: </p>
                <button onClick={handleProfile}>View User Profile</button>
                <button onClick={handleUpdate}>Update User Profile</button>
                <button onClick={handleWallet}>Wallet</button>
            </>
            ) : (
            <>
                <h3>User Profile</h3>
                <p>First Name: {profile.first_name}</p>
                <p>Last Name: {profile.last_name}</p>
                <p>Username: {profile.username}</p>
                <p>Email: {profile.email}</p>
                <p>Phone Number: {profile.phone_number}</p>
                <p>Address: {profile.address}</p>

                <button onClick={() => setProfile(null)}>Back</button>
            </>
            )}
            {error && <p style={{backgroundColor: '#fc4a4d', borderRadius: '5px', padding: '5px'}}>{error}</p>}
        </>
    );
};
