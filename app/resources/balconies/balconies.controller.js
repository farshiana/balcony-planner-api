// eslint-disable-next-line import/prefer-default-export
export const updateBalcony = async (req, res) => {
    try {
        const balcony = await res.locals.user.getBalcony();
        if (!balcony) {
            return res.status(404).send({ message: 'Balcony does not exist' });
        }

        if (balcony.id !== req.params.balconyId) {
            return res.status(401).send({ message: 'You cannot edit this balcony' });
        }

        await balcony.update({
            width: req.body.width,
            height: req.body.height,
        });
        return res.status(200).send(balcony);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
