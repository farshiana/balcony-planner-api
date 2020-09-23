import db from '../models/models';

const { Plant, Variety } = db;

export const addPlant = async (req, res) => {
    try {
        const variety = await Variety.findByPk(req.body.varietyId);
        if (!variety) {
            return res.status(404).send({ message: 'Variety does not exist' });
        }

        const plant = await Plant.create({
            userId: res.locals.user.id,
            varietyId: req.body.varietyId,
            notes: req.body.notes,
        });
        return res.status(201).send(plant);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

export const getAllPlants = async (req, res) => {
    try {
        const plants = await Plant.findAll({
            where: { userId: res.locals.user.id },
            include: [{ model: Variety, as: 'variety' }],
        });
        res.status(200).send(plants);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const updatePlant = async (req, res) => {
    try {
        const plant = await Plant.findByPk(req.params.plantId);
        if (!plant) {
            return res.status(404).send({ message: 'Plant does not exist' });
        }

        await plant.update({ notes: req.body.notes });
        return res.status(200).send(plant);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
