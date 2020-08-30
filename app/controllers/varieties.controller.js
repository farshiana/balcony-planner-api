import db from '../models/models';

const { Variety } = db;

export const addVariety = async (req, res) => {
    try {
        const variety = await Variety.create({
            name: req.body.name,
            category: req.body.category,
        });
        res.status(201).send(variety);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const getAllVarieties = async (req, res) => {
    try {
        const genera = await Variety.findAll();
        res.status(201).send(genera);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const updateVariety = async (req, res) => {
    try {
        const variety = await Variety.findByPk(req.params.varietyId).update({
            name: req.body.name,
            category: req.body.category,
        });
        res.status(201).send(variety);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
