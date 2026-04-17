const jwt = require('jsonwebtoken');

// 1. Verify the Cookie Token
exports.protect = (req, res, next) => {
    // Look for 'token' inside cookies
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Not authorized, please login" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Add user info (id and role) to the request object
        req.user = decoded; 
        next();
     
    } catch (err) {
        console.error('Token verification failed:', err.message);
        return res.status(401).json({ message: "Token failed, session expired" });
    }
};

// 2. Role-Based Authorization
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // req.user was set by the 'protect' middleware above
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Access denied. Role '${req.user.role}' is not authorized.` 
            });
        }
        next();
    };
};