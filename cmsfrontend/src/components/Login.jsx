import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const bypassLoginDev = import.meta.env.VITE_BYPASS_LOGIN_DEV === 'true';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

      
        if (bypassLoginDev) {
            console.warn("DEV MODE: Bypassing actual login API call.");

           
            const dummyToken = import.meta.env.VITE_DEV_JWT_TOKEN || 'fallback-dev-token-12345';

            localStorage.setItem('adminToken', dummyToken);
            onLogin(dummyToken); 
            navigate('/'); 

            return;
        }


        try {
            const response = await fetch('http://localhost:9001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            console.log('Full response:', response);

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('adminToken', data.token);
                onLogin(data.token);
                navigate('/');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            console.error("Login failed:", error);
            setError('Failed to connect to the server!');
        }
    };

    return (
        <div className="login-wrapper">
            <div className="registration-form">
                <h2>Admin Login</h2>
                {bypassLoginDev && (
                    <p style={{color: 'orange', fontWeight: 'bold', border: '1px solid orange', padding: '5px', borderRadius: '5px', marginBottom: '15px'}}>
                        Development Mode: Bypassing Login for Development purposes...
                    </p>
                )}
                {error && <p className="error">{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-input"
                    />
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input"
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;