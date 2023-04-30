const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');
require('dotenv').config()

mongoose.connect(process.env.MONGO_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/api/auth', userRoutes);

app.use('/api/sauces', saucesRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.post('/api/lol', (req, res, next) => {
    delete req.body._id;
    const sauce = new Sauce({
        ...req.body
    });
    sauce.save()
        .then(() => res.status(201).json({
            message: 'Objet enregistré !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
});

app.put('/api/sauces/:id', (req, res, next) => {
    Sauce.updateOne({
            _id: req.params.id
        }, {
            ...req.body,
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: 'Objet modifié !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
});

app.delete('/api/sauces/:id', (req, res, next) => {
    Sauce.deleteOne({
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: 'Objet supprimé !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
});

app.get('/api/sauces/:id', (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({
            error
        }));
});

app.get('/api/sauces', (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({
            error
        }));
});

module.exports = app;