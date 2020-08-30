export const addBalcony = async (req, res) => {
    try {
        const balcony = await res.locals.user.createBalcony({
            name: req.body.name,
            width: req.body.width,
            height: req.body.height,
        });
        res.status(201).send(balcony);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const getBalconies = async (req, res) => {
    try {
        const balconies = await res.locals.user.getBalconies();
        res.status(201).send(balconies);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
