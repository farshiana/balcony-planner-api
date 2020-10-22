import db from '../../models/models';

const { Planter, Planting, Plant } = db;

export const addPlanting = async (req, res) => {
    try {
        const planter = await Planter.findByPk(req.body.planterId);
        if (!planter) {
            return res.status(404).send({ message: 'Planter does not exist' });
        }

        const hasPlanter = await res.locals.user.hasPlanter(planter);
        if (!hasPlanter) {
            return res.status(401).send({ message: 'You cannot create this planting' });
        }

        const plant = await Plant.findByPk(req.body.plantId);
        if (!plant) {
            return res.status(404).send({ message: 'Plant does not exist' });
        }

        const hasPlant = await res.locals.user.hasPlant(plant);
        if (!hasPlant) {
            return res.status(401).send({ message: 'You cannot create this planting' });
        }

        const planting = await Planting.create({
            position: req.body.position,
            seed: req.body.seed,
            plant: req.body.plant,
            harvest: req.body.harvest,
            planterId: req.body.planterId,
            plantId: req.body.plantId,
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

export const deletePlanting = async (req, res) => {
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
            return res.status(401).send({ message: 'You cannot delete this planting' });
        }

        await planting.destroy();
        return res.status(204).send();
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
