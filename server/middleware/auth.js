const jwt = require('jsonwebtoken'); // Importation de jsonwebtoken pour la vérification des jetons JWT

// exportation d'une fonction Middleware pour vérifier l'auth JWT
module.exports = function(req, res, next) {
    const token = req.header('x-auth-token'); // récupération du jeton d'auth depuis les en-têtes de la request
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' }); // si aucun jeton fourni, renvoye une réponse 401 Unauthorized
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // vérif et décodage du jeton avec la clé secrète JWT
        req.user = decoded.user; // ajout de l'utilisateur décodé à l'objet de la request
        next(); // appel du middleware suivant dans la chaîne
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' }); // si la vérif échoue, renvoye une réponse 401
    }
};
