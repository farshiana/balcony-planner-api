import db from '../models/models';

const { Plant, Variety } = db;

export const addPlant = async (req, res) => {
    try {
        const variety = await Variety.findByPk(req.body.varietyId);
        if (!variety) {
            return res.status(404).send({ message: 'Variety was not found' });
        }

        const plant = await Plant.create({
            userId: res.locals.user.id,
            varietyId: req.body.varietyId,
            notes: req.body.notes,
        });
        return res.status(200).send(plant);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

export const getAllPlants = async (req, res) => {
    try {
        const plants = await Plant.find({ where: { userId: res.locals.user.id } });
        res.status(200).send(plants);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const updatePlant = async (req, res) => {
    try {
        const plant = await res.locals.user.updatePlant({
            notes: req.body.notes,
        });
        res.status(200).send(plant);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
