const jwt = require('jsonwebtoken');

exports.auth = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        
        console.log('authHeader', authHeader);
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No token provided or format invalid" });
        }

        const token = authHeader.split(" ")[1];
        console.log("Received Token:", token); // Log token for debugging

        const decoded = jwt.verify(token, 'jwtsecret'); // Verify token
        console.log("Decoded Token Data:", decoded); // Log decoded data

        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token Verification Error:", error);
        return res.status(401).json({ error: "Invalid token" });
    }
};
