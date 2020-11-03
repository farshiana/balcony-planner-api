import { Op } from 'sequelize';
import db from '../../models/models';

const { Variety, Genus } = db;

/**
 * @swagger
 * /varieties:
 *   post:
 *     tags:
 *       - Varieties
 *     description: Creates a variety
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Variety'
 *     responses:
 *       201:
 *         description: The created variety
 *         schema:
 *           $ref: '#/components/schemas/Variety'
 *       400:
 *          description: Invalid param
 *       401:
 *          description: User is not an admin
 *       500:
 *         description: Internal error
 */
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

/**
 * @swagger
 * /varieties:
 *   get:
 *     tags:
 *       - Varieties
 *     description: Lists varieties
 *     responses:
 *       200:
 *         description: The list of varieties
 *         schema:
 *           $ref: '#/components/schemas/Variety'
 *       500:
 *         description: Internal error
 */
export const getAllVarieties = async (req, res) => {
    try {
        const { genusId, query } = req.query;
        if (genusId) {
            const genus = await Genus.findByPk(genusId);
            if (!genus) {
                return res.status(404).send({ message: 'Genus does not exist' });
            }
        }

        const where = {};
        if (query) {
            where.name = { [Op.like]: `%${query}%` };
        }
        if (genusId) {
            where.genusId = genusId;
        }

        const varieties = await Variety.findAll({ where, order: ['name'] });
        return res.status(200).send(varieties);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

/**
 * @swagger
 * /varieties/{varietyId}:
 *   put:
 *     tags:
 *       - Varieties
 *     description: Updates a variety
 *     parameters:
 *       - in: path
 *         name: varietyId
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the variety
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Variety'
 *     responses:
 *       200:
 *         description: The updated variety
 *         schema:
 *           $ref: '#/components/schemas/Variety'
 *       400:
 *          description: Invalid param
 *       401:
 *          description: User is not an admin
 *       404:
 *          description: Variety does not exist
 *       500:
 *         description: Internal error
 */
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

/**
 * @swagger
 * /varieties/{varietyId}:
 *   delete:
 *     tags:
 *       - Varieties
 *     description: Deletes a variety
 *     parameters:
 *       - in: path
 *         name: varietyId
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the variety
 *     responses:
 *       200:
 *         description: The variety was deleted
 *       401:
 *          description: User is not an admin
 *       404:
 *          description: Variety does not exist
 *       500:
 *         description: Internal error
 */
export const deleteVariety = async (req, res) => {
    try {
        const variety = await Variety.findByPk(req.params.varietyId);
        if (!variety) {
            return res.status(404).send({ message: 'Variety does not exist' });
        }

        await variety.destroy();
        return res.status(200).send({ message: 'Variety was deleted' });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
