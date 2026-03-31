import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCookie,getCSRF } from '../Utils'
import styles from '../styles/home.module.css'

function CreateButton(props){
    return (
        <button className={styles.button} onClick={props.onClick}>{props.label}</button>
    )
}

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
        <div className={styles.body}>
            <div className={styles.header}>
                <h3 className={styles.title}>Welcome, {username}</h3>
                <CreateButton onClick={handlelogout} label="Log Out" />
            </div>
            {profile === null ? (
            <div className={styles.services}>
                <h3 className={styles.title}>Services: </h3>
                <CreateButton onClick={handleProfile} label="View User Profile" />
                <CreateButton onClick={handleUpdate} label="Update User Profile" />
                <CreateButton onClick={handleWallet} label="Wallet" />
            </div>
            ) : (
            <div className={styles.profile}>
                <h3 className={styles.title}>User Profile</h3>
                <div style={{display:"grid", gridTemplateColumns: "repeat(2,1fr)", gridTemplateRows: "repeat(6,1fr)", gap:"5px", margin:"10px"}}>
                <span style={{fontWeight: "bold"}}>First Name: </span><p>{profile.first_name}</p>
                <span style={{fontWeight: "bold"}}>Last Name: </span><p>{profile.last_name}</p>
                <span style={{fontWeight: "bold"}}>Username: </span><p>{profile.username}</p>
                <span style={{fontWeight: "bold"}}>Email: </span><p>{profile.email}</p>
                <span style={{fontWeight: "bold"}}>Phone Number: </span><p>{profile.phone_number}</p>
                <span style={{fontWeight: "bold"}}>Address: </span><p>{profile.address}</p>
                </div>
                <CreateButton onClick={() => setProfile(null)} label="Back" />
            </div>
            )}
            {error && <p style={{backgroundColor: '#fc4a4d', borderRadius: '5px', padding: '5px'}}>{error}</p>}
        </div>
    );
};
