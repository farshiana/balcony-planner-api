import db from '../models/models';

const { Genus } = db;

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

export const getAllGenera = async (req, res) => {
    try {
        const genera = await Genus.findAll();
        res.status(200).send(genera);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const updateGenus = async (req, res) => {
    try {
        const genus = await Genus.findByPk(req.params.genusId);
        if (!genus) {
            return res.status(404).send({ message: 'Genus was not found' });
        }

        await genus.update({
            name: req.body.name,
            category: req.body.category,
        });
        return res.status(200).send(genus);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
