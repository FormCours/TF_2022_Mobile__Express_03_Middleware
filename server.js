
const express = require('express');

// Création d'un server express
const server = express();

// Middleware "Application-level"
const middlewareApp = (req, res, next) => {
    const url = req.url;
    const now = new Date().toLocaleTimeString('fr-be');

    console.log(`Requete ${url} - ${now}`);
    next();
};
server.use(middlewareApp);

// Middleware "Router-level"
const middlewareRouter = (req, res, next) => {
    console.log('Middleware router has here :o');
    next();
};

// Ajout du routing
const router = express.Router();
router.get('/', middlewareRouter, middlewareRouter, (req, res) => {
    console.log('Traitement de la route /');
    res.send('<h1>Hello World</h1>');
});
router.get('/demo', middlewareRouter, (req, res) => {
    console.log('Traitement à risque -> Peut planté');
    // Exemple -> La DB n'est pas accessible
    throw new Error('Boum 💣');
});
server.use(router);

// Middleware "Error-Handling"
const middlewareError = (error, req, res, next) => {
    console.log('Traitement de l\'erreur : ', error.message);
    // Exemple : créer une fichier de log d'erreur -> Debug

    // Bonne pratique => Eviter une double ecriture du header
    if (res.headersSent) {
        return next(error);
    }

    res.status(500).send('<h1>Une erreur s\'est produite</h1>');
};
server.use(middlewareError);

// Demarrage du server
server.listen(8088, () => {
    console.log('Server up on port 8088');
});