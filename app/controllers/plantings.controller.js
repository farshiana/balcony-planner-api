import db from '../models/models';

const { Planter, Planting } = db;

export const addPlanting = async (req, res) => {
    try {
        const planter = await Planter.findByPk(req.params.planterId);
        if (!planter) {
            return res.status(404).send({ message: 'Planter was not found' });
        }

        if (!res.locals.user.hasPlanter(planter)) {
            return res.status(401).send({ message: 'You cannot create this planting' });
        }

        const planting = await planter.createPlanting({
            varietyId: req.body.varietyId,
            seed: req.body.seed,
            plant: req.body.plant,
            harvest: req.body.harvest,
        });
        return res.status(200).send(planting);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

export const updatePlanting = async (req, res) => {
    try {
        const planting = await Planting.findByPk(req.params.plantingId);
        if (!planting) {
            return res.status(404).send({ message: 'Planting was not found' });
        }

        const planter = await Planter.findByPk(req.params.planterId);
        if (!planter) {
            return res.status(404).send({ message: 'Planter was not found' });
        }

        if (!res.locals.user.hasPlanter(planter) || !planter.hasPlanting(planting)) {
            return res.status(401).send({ message: 'You cannot edit this planting' });
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
