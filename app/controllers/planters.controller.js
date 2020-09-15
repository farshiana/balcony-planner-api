import db from '../models/models';

const { Planter, Balcony } = db;

export const addPlanter = async (req, res) => {
    try {
        const balcony = await Balcony.findByPk(req.body.balconyId);
        if (!balcony) {
            return res.status(404).send({ message: 'Balcony was not found' });
        }

        const planter = await balcony.createPlanter({
            name: req.body.name,
            shape: req.body.shape,
            dimensions: req.body.dimensions,
            color: req.body.color,
            exposure: req.body.exposure,
        });
        return res.status(200).send(planter);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

export const getAllPlanters = async (req, res) => {
    try {
        const planters = await Planter.findAll();
        res.status(200).send(planters);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const updatePlanter = async (req, res) => {
    try {
        const planter = await Planter.findByPk(req.params.planterId);
        if (!planter) {
            return res.status(404).send({ message: 'Planter was not found' });
        }

        planter.update({
            name: req.body.name,
            shape: req.body.shape,
            dimensions: req.body.dimensions,
            color: req.body.color,
            exposure: req.body.exposure,
        });
        return res.status(200).send(planter);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
