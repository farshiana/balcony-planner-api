import db from '../models/models';

const { Balcony } = db;

// eslint-disable-next-line import/prefer-default-export
export const updateBalcony = async (req, res) => {
    try {
        const balcony = await Balcony.findByPk(req.params.balconyId);
        if (!balcony) {
            return res.status(404).send({ message: 'Balcony was not found' });
        }

        if (!res.locals.user.hasBalcony(balcony)) {
            return res.status(401).send({ message: 'You cannot edit this balcony' });
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
