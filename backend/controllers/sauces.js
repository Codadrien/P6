const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });

    sauce.save()
        .then(() => {
            res.status(201).json({
                message: 'Objet enregistré !'
            })
        })
        .catch(error => {
            res.status(400).json({
                error
            })
        })
};

exports.reviewsSauce = (req, res, next) => {
    let like = req.body.like;
    let userId = req.body.userId;
    const sauceId = req.params.id;
    Sauce.findOne({
            _id: sauceId
        })
        .then((sauce) => {
            const newValues = {
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked,
            };
            switch (like) {
                case 1:
                    newValues.usersLiked.push(userId);
                    break;
                case -1:
                    newValues.usersDisliked.push(userId);
                    break;
                case 0:
                    if (newValues.usersLiked.includes(userId)) {
                        const index = newValues.usersLiked.indexOf(userId);
                        newValues.usersLiked.splice(index, 1);
                    } else {
                        const index = newValues.usersDisliked.indexOf(userId);
                        newValues.usersDisliked.splice(index, 1);
                    }
                    break;
            }
            newValues.likes = newValues.usersLiked.length;
            newValues.dislikes = newValues.usersDisliked.length;
            Sauce.updateOne({
                _id: sauceId
            }, newValues).then(() =>
                res.status(200).json({
                    message: "Sauce évaluée !"
                })
            );
        })
        .catch((error) => res.status(500).json({
            error
        }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    };

    delete sauceObject._userId;
    Sauce.findOne({
            _id: req.params.id
        })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({
                    message: 'unauthorized request'
                });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                if (sauceObject.imageUrl) {
                    fs.unlink(`images/${filename}`, () => {
                        Sauce.updateOne({
                                _id: req.params.id
                            }, {
                                ...sauceObject,
                                _id: req.params.id
                            })
                            .then(() => res.status(200).json({
                                message: 'Objet modifié!'
                            }))
                            .catch(error => res.status(401).json({
                                error
                            }));
                    });
                } else {
                    Sauce.updateOne({
                            _id: req.params.id
                        }, {
                            ...sauceObject,
                            _id: req.params.id
                        })
                        .then(() => res.status(200).json({
                            message: 'Objet modifié!'
                        }))
                        .catch(error => res.status(401).json({
                            error
                        }));
                }
            }
        })
        .catch((error) => {
            res.status(400).json({
                error
            });
        });
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({
                    message: 'unauthorized request'
                });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({
                            _id: req.params.id
                        })
                        .then(() => {
                            res.status(200).json({
                                message: 'Objet supprimé !'
                            })
                        })
                        .catch(error => res.status(401).json({
                            error
                        }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                error
            });
        });
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};