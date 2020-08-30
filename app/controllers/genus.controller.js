import { Genus } from '../models/models';

export const addGenus = async (req, res) => {
    try {
        const genus = await Genus.create({
            name: req.body.name,
            category: req.body.category,
        });
        res.status(201).send(genus);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const getGenera = async (req, res) => {
    try {
        const genera = await Genus.findAll();
        res.status(201).send(genera);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const updateGenus = async (req, res) => {
    try {
        const genus = await Genus.findByPk(req.params.genusId).update({
            name: req.body.name,
            category: req.body.category,
        });
        res.status(201).send(genus);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
