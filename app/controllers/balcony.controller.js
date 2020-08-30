import { Balcony } from '../models';

export const addBalcony = async (req, res) => {
    try {
        const balcony = await req.session.user.addBalcony({
            name: req.body.name,
            width: req.body.width,
            height: req.body.height,
        });
        res.status(201).send(balcony);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
