const authorizeCliente = (req, res, next) => {
    if (req.user.rol_id !== 3) {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
    next();
};

module.exports = authorizeCliente;
