import db from '../models/models';

const { Variety, Genus } = db;

export const addVariety = async (req, res) => {
    try {
        const genus = await Genus.findByPk(req.body.genusId);
        if (!genus) {
            return res.status(404).send({ message: 'Genus was not found' });
        }

        const variety = await genus.createVariety({
            name: req.body.name,
            exposure: req.body.exposure,
            watering: req.body.watering,
            seed: req.body.seed,
            plant: req.body.plant,
            harvest: req.body.harvest,
        });
        return res.status(200).send(variety);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

export const getAllVarieties = async (req, res) => {
    try {
        const genera = await Variety.findAll();
        res.status(200).send(genera);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const updateVariety = async (req, res) => {
    try {
        const variety = await Variety.findByPk(req.params.varietyId);
        if (!variety) {
            return res.status(404).send({ message: 'Variety was not found' });
        }

        const genus = await Genus.findByPk(req.body.genusId);
        if (!genus) {
            return res.status(404).send({ message: 'Genus was not found' });
        }

        await variety.update({
            name: req.body.name,
            exposure: req.body.exposure,
            watering: req.body.watering,
            seed: req.body.seed,
            plant: req.body.plant,
            harvest: req.body.harvest,
        });
        return res.status(200).send(variety);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
