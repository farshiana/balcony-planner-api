import db from '../models/models';

const { Balcony } = db;

export const addBalcony = async (req, res) => {
    try {
        const balcony = await res.locals.user.createBalcony({
            name: req.body.name,
            width: req.body.width,
            height: req.body.height,
        });
        res.status(200).send(balcony);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const getAllBalconies = async (req, res) => {
    try {
        const balconies = await res.locals.user.getBalconies();
        res.status(200).send(balconies);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const updateBalcony = async (req, res) => {
    try {
        const balcony = await Balcony.findByPk(req.params.balconyId);
        if (!balcony) {
            return res.status(404).send({ message: 'Balcony was not found' });
        }

        if (!res.locals.user.hasBalcony(balcony)) {
            return res.status(401).send({ message: 'You don\t have access to this balcony' });
        }

        await balcony.update({
            name: req.body.name,
            width: req.body.width,
            height: req.body.height,
        });
        return res.status(200).send(balcony);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
