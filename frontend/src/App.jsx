import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/login'
import Register from './components/register'
import Home from './components/home'
import Update from './components/update'
import Wallet from './components/wallet'
import ProtectedRoute from './Utils'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/update" element={<ProtectedRoute><Update /></ProtectedRoute>} />
                <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;