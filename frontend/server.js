const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Proxy API requests to backend
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:5001',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/api' // keep /api prefix
    },
    onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Backend server is not running. Please start the backend on port 5001.' 
        });
    }
}));

// Handle all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Frontend server running at http://localhost:${PORT}`);
    console.log(`✅ API Proxy forwarding to http://localhost:5001/api`);
});