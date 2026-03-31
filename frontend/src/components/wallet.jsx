import { useState,useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import { getCSRF } from '../Utils'
import styles from '../styles/home.module.css'

function CreateButton(props){
    return (
        <button name={props.name} className={styles.button} onClick={props.onClick}>{props.label}</button>
    )
}

export default function Wallet(){
    const navigate = useNavigate();
    const [details,setDetails] = useState(null);
    const [error,setError] = useState('');
    const [success,setSuccess] = useState('');
    const [toggle,setToggle] = useState({
        view : false,
        transaction : false,
        history : false
    });

    const fetchWallet = async () => {
        const res = await fetch('http://localhost:8000/ewallet/wallet/view/', {
            method: "GET",
            credentials: "include",
            headers: {"Content-Type": "application/json"}
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.error || "Something went wrong");
        } else {
            console.log(data);
            setDetails(data);
        }
    };

    useEffect(() => {
        fetchWallet();
    }, []);

    const createWallet = async () => {
        setError('');
        setSuccess('');
        const res = await fetch('http://localhost:8000/ewallet/wallet/create/', {
            method: 'POST',
            credentials: 'include',
            headers: {"Content-Type": "application/json",
                'X-CSRFToken': getCSRF()
            }
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
            setTimeout(()=>{setSuccess(''); fetchWallet();}, 1500);
        }
    };

    const handleView = (e) => {
        const {name} = e.target;
        setToggle(prev => ({
            ...prev,
            [name] : !prev[name]
        }));
    };

    const handleTransaction = () => {

    };

    const handleHistory = () => {

    };

    const handleNotification = () => {
        navigate('/notifications');
    };

    return(<div className={styles.body}>
        {success && <p style={{backgroundColor: '#5cfc4a', borderRadius: '10px', padding: '10px'}}>{success}</p>}
        {error=='This user has no wallet currently' && <div className="errorClass">
        <p style={{backgroundColor: '#fc4a4d', borderRadius: '10px', padding: '10px', fontSize: "30px"}}>{error}</p>
        <CreateButton name="create" onClick={createWallet} label='Create New Wallet' /></div>}

        {error=='Something went wrong' && <p style={{backgroundColor: '#fc4a4d', borderRadius: '5px', padding: '5px'}}>{error}</p>}

        {!error && details && <>
        <div className={styles.header}>
            <h3 className={styles.title}>Balance: NRs. {details.balance}</h3>
        </div>
        {!toggle.view && !toggle.transaction && !toggle.history && 
        <div className={styles.wideservices}>
            <h3 className={styles.title}>Services: </h3>
            <CreateButton name="view" onClick={handleView} label="View Wallet Details" />
            <CreateButton name="transaction" onClick={handleTransaction} label="Transfer Money" />
            <CreateButton name="history" onClick={handleHistory} label="View Transaction Statement" />
            <CreateButton name="notification" onClick={handleNotification} label="Notifications" />
        </div>}
        {toggle.view && !toggle.transaction && !toggle.history &&
        <div className={styles.profile}>
            <h3 className={styles.title}>Wallet Details</h3>
            <div style={{display:"grid", gridTemplateColumns: "repeat(2,1fr)", gridTemplateRows: "repeat(6,1fr)", gap:"5px", margin:"10px"}}>
            <span style={{fontWeight: "bold"}}>User Id: </span><p>{details.user_id}</p>
            <span style={{fontWeight: "bold"}}>Wallet Id: </span><p>{details.wallet_id}</p>
            <span style={{fontWeight: "bold"}}>Status: </span><p>{details.status}</p>
            <span style={{fontWeight: "bold"}}>Currency: </span><p>{details.currency}</p>
            <span style={{fontWeight: "bold"}}>Balance: </span><p>{details.balance}</p>
            <span style={{fontWeight: "bold"}}>Created At: </span><p>{details.created_at}</p>
            </div>
            <CreateButton name="view" onClick={handleView} label="Back" />
        </div>}
        {!toggle.view && toggle.transaction && !toggle.history &&
        <></>}
        {!toggle.view && !toggle.transaction && toggle.history &&
        <></>}
        </>}
        </div>
    );
};