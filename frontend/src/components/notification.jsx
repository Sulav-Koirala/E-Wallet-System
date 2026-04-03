import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../styles/notification.module.css'

export default function Notification() {
    const [notification,setNotifications] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        setError('');
        const res = await fetch('http://localhost:8000/ewallet/notification/view/', {
            method: "GET",
            credentials: "include",
            headers: {"Content-Type": "application/json"}
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.error || "Something went wrong");
        } else {
            setNotifications(data);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleReturn = () => {
        navigate('/wallet');
    }

    return (
        <div className={styles.body}>
            {error && <p style={{backgroundColor: '#fc4a4d', borderRadius: '5px', padding: '5px'}}>{error}</p>}
            <div className={styles.header}>
                <div className={styles.title}>Notifications</div>
                <button className={styles.button} onClick={handleReturn}>Back</button>
            </div>
            <div className={styles.container}>
            {notification && notification.map((n) => (<div key={n.notification_id} style={{display:"grid", gridTemplateColumns: "repeat(2,1fr)", gridTemplateRows: "repeat(4,1fr)", gap:"5px", margin:"10px"}}>
            <span style={{fontWeight: "bold"}}>Notification ID: </span><p>{n.notification_id}</p>
            <span style={{fontWeight: "bold"}}>Message: </span><p>{n.message}</p>
            <span style={{fontWeight: "bold"}}>Type: </span><p>{n.type}</p>
            <span style={{fontWeight: "bold"}}>Sent Date: </span><p>{n.created_at}</p>
            <hr />
            </div>))}
            </div>
        </div>
    );
};