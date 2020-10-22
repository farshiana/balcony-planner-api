import { Op } from 'sequelize';
import db from '../../models/models';

const { Variety, Genus } = db;

export const addVariety = async (req, res) => {
    try {
        const genus = await Genus.findByPk(req.body.genusId);
        if (!genus) {
            return res.status(404).send({ message: 'Genus does not exist' });
        }

        const variety = await genus.createVariety({
            name: req.body.name,
            imageUrl: req.body.imageUrl,
            exposure: req.body.exposure,
            watering: req.body.watering,
            seed: req.body.seed,
            plant: req.body.plant,
            harvest: req.body.harvest,
        });
        return res.status(201).send(variety);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

export const getAllVarieties = async (req, res) => {
    try {
        const { genusId, query } = req.query;
        if (genusId) {
            const genus = await Genus.findByPk(genusId);
            if (!genus) {
                return res.status(404).send({ message: 'Genus does not exist' });
            }

            const varieties = await genus.getVarieties();
            return res.status(200).send(varieties);
        }

        const where = {};
        if (query) {
            where.name = { [Op.like]: `%${query}%` };
        }

        const varieties = await Variety.findAll({ where });
        return res.status(200).send(varieties);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

export const updateVariety = async (req, res) => {
    try {
        const variety = await Variety.findByPk(req.params.varietyId);
        if (!variety) {
            return res.status(404).send({ message: 'Variety does not exist' });
        }

        await variety.update({
            name: req.body.name,
            imageUrl: req.body.imageUrl,
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

export const deleteVariety = async (req, res) => {
    try {
        const variety = await Variety.findByPk(req.params.varietyId);
        if (!variety) {
            return res.status(404).send({ message: 'Variety does not exist' });
        }

        await variety.destroy();
        return res.status(204).send();
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
