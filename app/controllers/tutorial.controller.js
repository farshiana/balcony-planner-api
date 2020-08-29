const db = require('..');

const Tutorial = db.tutorials;
const { Op } = db.Sequelize;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: 'Content can not be empty!',
        });
        return;
    }

    // Create a Tutorial
    const tutorial = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false,
    };

    // Save Tutorial in the database
    Tutorial.create(tutorial)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
            error.message || 'Some error occurred while creating the Tutorial.',
            });
        });
};

exports.findAll = (req, res) => {
    const { title } = req.query;
    const condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

    Tutorial.findAll({ where: condition })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
            error.message || 'Some error occurred while retrieving tutorials.',
            });
        });
};

exports.findOne = (req, res) => {
    const { id } = req.params;

    Tutorial.findByPk(id)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: `Error retrieving Tutorial with id=${id}`,
            });
        });
};

exports.update = (req, res) => {
    const { id } = req.params;

    Tutorial.update(req.body, {
        where: { id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: 'Tutorial was updated successfully.',
                });
            } else {
                res.send({
                    message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: `Error updating Tutorial with id=${id}`,
            });
        });
};

exports.delete = (req, res) => {
    const { id } = req.params;

    Tutorial.destroy({
        where: { id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: 'Tutorial was deleted successfully!',
                });
            } else {
                res.send({
                    message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: `Could not delete Tutorial with id=${id}`,
            });
        });
};

exports.deleteAll = (req, res) => {
    Tutorial.destroy({
        where: {},
        truncate: false,
    })
        .then((nums) => {
            res.send({ message: `${nums} Tutorials were deleted successfully!` });
        })
        .catch((err) => {
            res.status(500).send({
                message:
            error.message || 'Some error occurred while removing all tutorials.',
            });
        });
};

exports.findAllPublished = (req, res) => {
    Tutorial.findAll({ where: { published: true } })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
            error.message || 'Some error occurred while retrieving tutorials.',
            });
        });
};