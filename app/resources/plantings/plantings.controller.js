import db from '../../models/models';

const { Planter, Planting, Variety } = db;

export const addPlanting = async (req, res) => {
    try {
        const planter = await Planter.findByPk(req.body.planterId);
        if (!planter) {
            return res.status(404).send({ message: 'Planter does not exist' });
        }

        const variety = await Variety.findByPk(req.body.varietyId);
        if (!variety) {
            return res.status(404).send({ message: 'Variety does not exist' });
        }

        const belongs = await res.locals.user.hasPlanter(planter);
        if (!belongs) {
            return res.status(401).send({ message: 'You cannot create this planting' });
        }

        const planting = await Planting.create({
            position: req.body.position,
            seed: req.body.seed,
            plant: req.body.plant,
            harvest: req.body.harvest,
            planterId: req.body.planterId,
            varietyId: req.body.varietyId,
        });
        return res.status(201).send(planting);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

export const updatePlanting = async (req, res) => {
    try {
        const planting = await Planting.findByPk(req.params.plantingId);
        if (!planting) {
            return res.status(404).send({ message: 'Planting does not exist' });
        }

        const planter = await Planter.findByPk(planting.planterId);
        if (!planter) {
            return res.status(404).send({ message: 'Planter does not exist' });
        }

        const belongs = await res.locals.user.hasPlanter(planter);
        if (!belongs) {
            return res.status(401).send({ message: 'You cannot edit this planting' });
        }

        await planting.update({
            position: req.body.position,
            seed: req.body.seed,
            plant: req.body.plant,
            harvest: req.body.harvest,
        });
        return res.status(200).send(planting);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
