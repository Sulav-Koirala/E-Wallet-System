import { useState,useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import { getCSRF } from '../Utils'
import styles from '../styles/home.module.css'

function CreateButton(props){
    return (
        <button className={styles.button} onClick={props.onClick}>{props.label}</button>
    )
}

export default function Wallet(){
    const navigate = useNavigate();
    const [details,setDetails] = useState(null);
    const [error,setError] = useState('');
    const [success,setSuccess] = useState('');
    const [activePanel, setActivePanel] = useState(null);
    const [wallet_id,setWalletID] = useState('');
    const [amount,setAmount] = useState('');
    const [statement,setStatement] = useState(null);

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

    const handleTransaction = async(e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const res = await fetch(`http://localhost:8000/ewallet/transaction/transfer/${wallet_id}/`, {
            method: 'POST',
            credentials: 'include',
            headers: {"Content-Type": "application/json",
                'X-CSRFToken': getCSRF()
            },
            body: JSON.stringify({amount: Number(amount)})
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

    const changeWalletID = (e) => {
        const {value} = e.target;
        setWalletID(value);
    };

    const changeAmount = (e) => {
        const {value} = e.target;
        setAmount(value);
    };

    const handleHistory = async() => {
        const res = await fetch('http://localhost:8000/ewallet/transaction/statement/', {
            method: "GET",
            credentials: "include",
            headers: {"Content-Type": "application/json"}
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.error || "Something went wrong");
        } else {
            setStatement(data);
        }
    };

    const handleNotification = () => {
        navigate('/notifications');
    };

    const handleBack = () => {
        navigate('/home');
    }

    return(<div className={styles.body}>
        {success=='Wallet created successfully' && <p style={{backgroundColor: '#5cfc4a', borderRadius: '10px', padding: '10px'}}>{success}</p>}
        {error=='This user has no wallet currently' && <div className="errorClass">
        <p style={{backgroundColor: '#fc4a4d', borderRadius: '10px', padding: '10px', fontSize: "30px"}}>{error}</p>
        <CreateButton onClick={createWallet} label='Create New Wallet' /></div>}

        {error=='Something went wrong' && <p style={{backgroundColor: '#fc4a4d', borderRadius: '5px', padding: '5px'}}>{error}</p>}

        {details && <>
        <div className={styles.header}>
            <h3 className={styles.title}>Balance: NRs. {details.balance}</h3>
        </div>
        {activePanel === null &&
        <div className={styles.wideservices}>
            <h3 className={styles.title}>Services: </h3>
            <CreateButton onClick={() => setActivePanel('view')} label="View Wallet Details" />
            <CreateButton onClick={() => setActivePanel('transaction')} label="Transfer Money" />
            <CreateButton onClick={() => setActivePanel('history')} label="View Transaction Statement" />
            <CreateButton onClick={handleNotification} label="Notifications" />
            <CreateButton onClick={handleBack} label="Back" />
        </div>}
        {activePanel === 'view' && 
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
            <CreateButton onClick={() => setActivePanel(null)} label="Back" />
        </div>}
        {activePanel === 'transaction' && 
        <div className={styles.body}>
            <div className={styles.container}>
                <h1 className={styles.title}>Transaction</h1>
                <form className={styles.form} onSubmit={handleTransaction}>
                <label>Wallet ID to: </label><input className={styles.input} type="number" value={wallet_id} onChange={changeWalletID} placeholder="Enter Wallet ID..."  required />
                <label>Amount: </label><input className={styles.input} type="number" step="0.01" value={amount} onChange={changeAmount} placeholder="Enter Amount..." required />
                <button className={styles.button} type="submit">Transfer</button>
                </form>
                <CreateButton onClick={() => setActivePanel(null)} label="Back" />
                {error && <p style={{backgroundColor: '#fc4a4d', borderRadius: '5px', padding: '5px'}}>{error}</p>}
                {success && <p style={{backgroundColor: '#79f341', borderRadius: '5px', padding: '5px'}}>{success}</p>}
            </div>
        </div>}
        {activePanel === 'history' && 
        <div className={styles.profile}>
            <h3 className={styles.title}>Transaction Statement</h3>
            <div style={{display:"grid", gridTemplateColumns: "repeat(2,1fr)", gridTemplateRows: "repeat(6,1fr)", gap:"5px", margin:"10px"}}>
            {/* <span style={{fontWeight: "bold"}}>User Id: </span><p>{details.user_id}</p>
            <span style={{fontWeight: "bold"}}>Wallet Id: </span><p>{details.wallet_id}</p>
            <span style={{fontWeight: "bold"}}>Status: </span><p>{details.status}</p>
            <span style={{fontWeight: "bold"}}>Currency: </span><p>{details.currency}</p>
            <span style={{fontWeight: "bold"}}>Balance: </span><p>{details.balance}</p>
            <span style={{fontWeight: "bold"}}>Created At: </span><p>{details.created_at}</p> */}
            </div>
            <CreateButton onClick={() => setActivePanel(null)} label="Back" />
        </div>}</>}
    </div>
    );
};