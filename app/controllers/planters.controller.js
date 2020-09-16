import db from '../models/models';

const { Planter } = db;

export const addPlanter = async (req, res) => {
    try {
        const planter = await res.locals.user.createPlanter({
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
        const planters = await res.locals.user.getPlanters();
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

        if (!res.locals.user.hasPlanter(planter)) {
            return res.status(401).send({ message: 'You cannot edit this planter' });
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
