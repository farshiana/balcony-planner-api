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
