import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie,getCSRF } from '../Utils'
import styles from '../styles/home.module.css'

function CreateButton(props) {
    return (
        <button className={styles.button} onClick={props.onClick}>{props.label}</button>
    )
}

export default function Wallet() {
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activePanel, setActivePanel] = useState(null);
    const [wallet_id, setWalletID] = useState('');
    const [amount, setAmount] = useState('');
    const [statement, setStatement] = useState([]);
    const [notification_id, setNotID] = useState('');
    const [Notdata, setNotData] = useState(null);
    const admin_user = getCookie("admin_user");
    const [userId,setUserID] = useState('');
    const [walStatus,setWalStatus] = useState('');
    const [message,setMessage] = useState('');

    const fetchWallet = async () => {
        const res = await fetch('http://localhost:8000/ewallet/wallet/view/', {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.error || "Something went wrong");
        } else {
            setDetails(data);
        }
    };

    useEffect(() => { fetchWallet(); }, []);

    const createWallet = async () => {
        setError(''); setSuccess('');
        const res = await fetch('http://localhost:8000/ewallet/wallet/create/', {
            method: 'POST', credentials: 'include',
            headers: { "Content-Type": "application/json", 'X-CSRFToken': getCSRF() }
        });
        let data;
        try { data = await res.json(); }
        catch { setError(`Server error: ${res.status} ${res.statusText}`); return; }
        if (!res.ok) {
            setError(data.error || 'Something went wrong');
        } else {
            setSuccess(data.message);
            setTimeout(() => { setSuccess(''); fetchWallet(); }, 1500);
        }
    };

    const handleTransaction = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        const res = await fetch(`http://localhost:8000/ewallet/transaction/transfer/${wallet_id}/`, {
            method: 'POST', credentials: 'include',
            headers: { "Content-Type": "application/json", 'X-CSRFToken': getCSRF() },
            body: JSON.stringify({ amount: Number(amount) })
        });
        let data;
        try { data = await res.json(); }
        catch { setError(`Server error: ${res.status} ${res.statusText}`); return; }
        if (!res.ok) {
            setError(data.error || 'Something went wrong');
        } else {
            setSuccess(data.message);
            setWalletID('');
            setAmount('');
            setTimeout(() => { setSuccess(''); fetchWallet(); }, 1500);
        }
    };

    const handleHistory = async () => {
        setError('');
        const res = await fetch('http://localhost:8000/ewallet/transaction/statement/', {
            method: "GET", credentials: "include",
            headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.error || "Something went wrong");
            setStatement([]);
            setActivePanel('history');
        } else {
            setStatement(data);
            setActivePanel('history');
        }
    };

    const handleSingleNotification = async (e) => {
        e.preventDefault();
        setError('');
        const res = await fetch(`http://localhost:8000/ewallet/notification/see/${notification_id}/`, {
            method: 'PATCH', credentials: 'include',
            headers: { "Content-Type": "application/json", 'X-CSRFToken': getCSRF() },
            body: JSON.stringify({ notification_id: Number(notification_id) })
        });
        let data;
        try { data = await res.json(); }
        catch { setError(`Server error: ${res.status} ${res.statusText}`); return; }
        if (!res.ok) {
            setError(data.error || 'Something went wrong');
        } else {
            setNotData(data);
        }
    };

    const handleUpdateWallet = async(e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const res = await fetch('http://localhost:8000/ewallet/wallet/status/', {
            method: 'PUT', credentials: 'include',
            headers: { "Content-Type": "application/json", 'X-CSRFToken': getCSRF() },
            body: JSON.stringify({ user_id: Number(userId), status: walStatus })
        });
        let data;
        try { data = await res.json(); }
        catch { setError(`Server error: ${res.status} ${res.statusText}`); return; }
        if (!res.ok) {
            setError(data.error || 'Something went wrong');
        } else {
            setSuccess(data.message);
            setUserID('');
        }
    };

    const handleLoadWallet = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const res = await fetch ('http://localhost:8000/ewallet/transaction/load/', {
            method: 'POST', credentials: 'include',
            headers: { "Content-Type": "application/json", 'X-CSRFToken': getCSRF() },
            body: JSON.stringify({ amount: Number(amount) })
        });
        let data;
        try { data = await res.json(); }
        catch { setError(`Server error: ${res.status} ${res.statusText}`); return; }
        if (!res.ok) {
            setError(data.error || 'Something went wrong');
        } else {
            setSuccess(data.message);
            setTimeout(() => { setSuccess(''); fetchWallet(); }, 1500);
            setAmount('');
        }
    };

    const handleSendNotification = async(e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const res = await fetch ('http://localhost:8000/ewallet/notification/send/', {
            method: 'POST', credentials: 'include',
            headers: { "Content-Type": "application/json", 'X-CSRFToken': getCSRF() },
            body: JSON.stringify({ user_id: Number(userId), message: message })
        });
        let data;
        try { data = await res.json(); }
        catch { setError(`Server error: ${res.status} ${res.statusText}`); return; }
        if (!res.ok) {
            setError(data.error || 'Something went wrong');
        } else {
            setSuccess(data.message);
            setTimeout(() => { setSuccess(''); fetchWallet(); }, 1500);
            setUserID('');
        }
    };

    return (
        <div className={styles.body}>
            {success === 'Wallet created successfully' && <p style={{ backgroundColor: '#5cfc4a', borderRadius: '10px', padding: '10px' }}>{success}</p>}
            {error === 'This user has no wallet currently' &&
                <div>
                    <p style={{ backgroundColor: '#fc4a4d', borderRadius: '10px', padding: '10px', fontSize: "30px" }}>{error}</p>
                    <CreateButton onClick={createWallet} label='Create New Wallet' />
                </div>}

            {details && <>
                <div className={styles.header}>
                    <h3 className={styles.title}>Balance: NRs. {details.balance}</h3>
                </div>

                {activePanel === null &&
                    <div className={styles.wideservices}>
                        <h3 className={styles.title}>Services:</h3>
                        {admin_user==='True' && <CreateButton onClick={() => {setError(''); setSuccess(''); setActivePanel('load_wallet')}} label="Load Wallet" />}
                        <CreateButton onClick={() => setActivePanel('view')} label="View Wallet Details" />
                        <CreateButton onClick={() => {setError(''); setSuccess(''); setActivePanel('transaction');}} label="Transfer Money" />
                        <CreateButton onClick={handleHistory} label="View Transaction Statement" />
                        <CreateButton onClick={() => navigate('/notifications')} label="Notifications" />
                        <CreateButton onClick={() => {setNotData(null); setError(''); setSuccess(''); setActivePanel('single');}} label="View Specific Notification" />
                        {admin_user==='True' && <CreateButton onClick={() => {setError(''); setSuccess(''); setActivePanel('create_notification')}} label="Send Notification" />}
                        <CreateButton onClick={() => navigate('/home')} label="Back" />
                    </div>}

                {activePanel === 'view' &&
                    <div className={styles.profile}>
                        <h3 className={styles.title}>Wallet Details</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "5px", margin: "10px" }}>
                            <span style={{ fontWeight: "bold" }}>User Id:</span><p>{details.user_id}</p>
                            <span style={{ fontWeight: "bold" }}>Wallet Id:</span><p>{details.wallet_id}</p>
                            <span style={{ fontWeight: "bold" }}>Status:</span><p>{details.status}</p>
                            <span style={{ fontWeight: "bold" }}>Currency:</span><p>{details.currency}</p>
                            <span style={{ fontWeight: "bold" }}>Balance:</span><p>{details.balance}</p>
                            <span style={{ fontWeight: "bold" }}>Created At:</span><p>{details.created_at}</p>
                        </div>
                        <CreateButton onClick={() => setActivePanel(null)} label="Back" />
                    </div>}

                {activePanel === 'transaction' &&
                    <div className={styles.container}>
                        <h1 className={styles.title}>Transaction</h1>
                        <form className={styles.form} onSubmit={handleTransaction}>
                            <label>Wallet ID to:</label>
                            <input className={styles.input} type="number" value={wallet_id} onChange={e => setWalletID(e.target.value)} placeholder="Enter Wallet ID..." required />
                            <label>Amount:</label>
                            <input className={styles.input} type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter Amount..." required />
                            <button className={styles.button} type="submit">Transfer</button>
                        </form>
                        <CreateButton onClick={() => setActivePanel(null)} label="Back" />
                        {error && <p style={{ backgroundColor: '#fc4a4d', borderRadius: '5px', padding: '5px' }}>{error}</p>}
                        {success && <p style={{ backgroundColor: '#79f341', borderRadius: '5px', padding: '5px' }}>{success}</p>}
                    </div>}

                {activePanel === 'history' &&
                    <div className={styles.profile}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                            <h3 className={styles.title}>Transaction Statement</h3>
                            <CreateButton onClick={() => setActivePanel(null)} label="Back" />
                        </div>
                        {!error && Array.isArray(statement) && statement.length === 0 && <p>No Transactions Yet</p>}
                        {error && <p style={{ backgroundColor: '#fc4a4d', borderRadius: '5px', padding: '5px' }}>{error}</p>}
                        {!error && Array.isArray(statement) && statement.map((s) => (
                            <div key={s.transaction_id} style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "5px", margin: "10px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
                                <span style={{ fontWeight: "bold" }}>Transaction ID:</span><p>{s.transaction_id}</p>
                                <span style={{ fontWeight: "bold" }}>Status:</span><p>{s.status}</p>
                                <span style={{ fontWeight: "bold" }}>Type:</span><p>{s.type}</p>
                                <span style={{ fontWeight: "bold" }}>Amount:</span><p>NRs. {s.amount}</p>
                                <span style={{ fontWeight: "bold" }}>Reference ID:</span><p>{s.reference_id}</p>
                                <span style={{ fontWeight: "bold" }}>Sender:</span><p>{s.sender}</p>
                                <span style={{ fontWeight: "bold" }}>Receiver:</span><p>{s.receiver}</p>
                                <span style={{ fontWeight: "bold" }}>Date:</span><p>{s.transaction_date}</p>
                            </div>
                        ))}
                    </div>}

                    {activePanel === 'single' &&
                        <div className={styles.container}>
                            <h1 className={styles.title}>See Notification</h1>
                            
                            {!Notdata && 
                                <form className={styles.form} onSubmit={handleSingleNotification}>
                                    <label>Notification ID:</label>
                                    <input className={styles.input} type="number" value={notification_id} onChange={e => setNotID(e.target.value)} placeholder="Enter Notification ID..." required />
                                    <button className={styles.button} type="submit">View</button>
                                </form>}

                            <CreateButton onClick={() => { setActivePanel(null); setNotData(null); }} label="Back" />
                            {error && <p style={{ backgroundColor: '#fc4a4d', borderRadius: '5px', padding: '5px' }}>{error}</p>}
                            
                            {Notdata &&
                                <div className={styles.profile} style={{ marginTop: '10px' }}>
                                    <h3 className={styles.title}>Notification Details</h3>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "5px", margin: "10px" }}>
                                        <span style={{ fontWeight: "bold" }}>Notification ID:</span><p>{Notdata.notification_id}</p>
                                        <span style={{ fontWeight: "bold" }}>Message:</span><p>{Notdata.message}</p>
                                        <span style={{ fontWeight: "bold" }}>Type:</span><p>{Notdata.type}</p>
                                        <span style={{ fontWeight: "bold" }}>Sent Date:</span><p>{Notdata.created_at}</p>
                                    </div>
                                </div>}
                        </div>}
                    
                    {activePanel === 'update_wallet' &&
                        <div className={styles.container}>
                            <h1 className={styles.title}>Change Wallet Status</h1>
                            <form className={styles.form} onSubmit={handleUpdateWallet}>
                                <label>User ID:</label>
                                <input className={styles.input} type="number" value={userId} onChange={e => setUserID(e.target.value)} placeholder="Enter User ID..." required />
                                <label>Status:</label>
                                <input className={styles.input} type="text" value={walStatus} onChange={e => setWalStatus(e.target.value)} placeholder="Enter status..." required />
                                    <button className={styles.button} type="submit">Change</button>
                                </form>
                            <CreateButton onClick={() => {setActivePanel(null);}} label="Back" />
                            {error && <p style={{ backgroundColor: '#fc4a4d', borderRadius: '5px', padding: '5px' }}>{error}</p>}
                            {success && <p style={{ backgroundColor: '#79f341', borderRadius: '5px', padding: '5px' }}>{success}</p>}
                        </div>}
                    
                    {activePanel === 'load_wallet' &&
                        <div className={styles.container}>
                            <h1 className={styles.title}>Load Wallet</h1>
                            <form className={styles.form} onSubmit={handleLoadWallet}>
                                <label>Amount:</label>
                                <input className={styles.input} type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter Amount..." required />
                                <button className={styles.button} type="submit">Load</button>
                                </form>
                            <CreateButton onClick={() => {setActivePanel(null);}} label="Back" />
                            {error && <p style={{ backgroundColor: '#fc4a4d', borderRadius: '5px', padding: '5px' }}>{error}</p>}
                            {success && <p style={{ backgroundColor: '#79f341', borderRadius: '5px', padding: '5px' }}>{success}</p>}
                        </div>}

                    {activePanel === 'create_notification' &&
                        <div className={styles.container}>
                            <h1 className={styles.title}>Send Notification</h1>
                            <form className={styles.form} onSubmit={handleSendNotification}>
                                <label>User ID:</label>
                                <input className={styles.input} type="number" value={userId} onChange={e => setUserID(e.target.value)} placeholder="Enter User ID..." required />
                                <label>Message</label>
                                <input className={styles.input} type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="Enter message..." required />
                                <button className={styles.button} type="submit">Send</button>
                                </form>
                            <CreateButton onClick={() => {setActivePanel(null);}} label="Back" />
                            {error && <p style={{ backgroundColor: '#fc4a4d', borderRadius: '5px', padding: '5px' }}>{error}</p>}
                            {success && <p style={{ backgroundColor: '#79f341', borderRadius: '5px', padding: '5px' }}>{success}</p>}
                        </div>}
                    </>}
                    </div>
            );
};