import db from '../models/models';

const { Planting, Variety, Planter } = db;

export const addPlanting = async (req, res) => {
    try {
        const planter = await Planter.findByPk(req.body.planterId);
        if (!planter) {
            return res.status(404).send({ message: 'Planter was not found' });
        }

        const variety = await Variety.findByPk(req.body.varietyId);
        if (!variety) {
            return res.status(404).send({ message: 'Variety was not found' });
        }

        const planting = await Planting.create({
            planterId: req.body.planterId,
            varietyId: req.body.varietyId,
            userId: res.locals.user.id,
            seed: req.body.seed,
            plant: req.body.plant,
            harvest: req.body.harvest,
        });
        return res.status(200).send(planting);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

export const getAllPlantings = async (req, res) => {
    try {
        const plantings = await res.locals.user.getPlantings();
        res.status(200).send(plantings);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const updatePlanting = async (req, res) => {
    try {
        const planting = await Planting.findByPk(req.params.plantingId);
        if (!planting) {
            return res.status(404).send({ message: 'Planting was not found' });
        }

        await planting.update({
            seed: req.body.seed,
            plant: req.body.plant,
            harvest: req.body.harvest,
        });
        return res.status(200).send(planting);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
