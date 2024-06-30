module.exports = function(req, res, next) {
    if (req.user.role !== 'Admin') {
        return res.status(401).json({ msg: 'Admin only' });
    }
    next();
}