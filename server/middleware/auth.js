const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ msg: 'Access denied' });
        }
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
