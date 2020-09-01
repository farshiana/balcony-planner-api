import db from '../models/models';

const { Variety, Genus } = db;

export const addVariety = async (req, res) => {
    try {
        const genus = await Genus.findByPk(req.params.genusId);
        if (!genus) {
            return res.status(404).send({ message: 'Genus was not found' });
        }

        const variety = await genus.createVariety({
            name: req.body.name,
            exposure: req.body.exposure,
            watering: req.body.watering,
            steps: req.body.steps,
        });
        return res.status(201).send(variety);
    } catch (error) {
        return res.status(500).send({ message: error.message });
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
            exposure: req.body.exposure,
            watering: req.body.watering,
        });
        res.status(201).send(variety);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};