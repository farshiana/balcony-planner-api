import db from '../../models/models';

const { Genus } = db;

/**
 * @swagger
 * /genera:
 *   post:
 *     tags:
 *       - Genera
 *     description: Creates a genus
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Genus'
 *     responses:
 *       201:
 *         description: The created genus
 *         schema:
 *           $ref: '#/components/schemas/Genus'
 *       400:
 *          description: Invalid param
 *       401:
 *          description: User is not an admin
 *       500:
 *         description: Internal error
 */
export const addGenus = async (req, res) => {
    try {
        const genus = await Genus.create({
            name: req.body.name,
            category: req.body.category,
        });
        res.status(201).send(genus);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

/**
 * @swagger
 * /genera:
 *   get:
 *     tags:
 *       - Genera
 *     description: Lists genera
 *     responses:
 *       200:
 *         description: The list of genera
 *         schema:
 *           $ref: '#/components/schemas/Genus'
 *       500:
 *         description: Internal error
 */
export const getAllGenera = async (req, res) => {
    try {
        const genera = await Genus.findAll({ order: ['name'] });
        res.status(200).send(genera);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

/**
 * @swagger
 * /genera/{genusId}:
 *   put:
 *     tags:
 *       - Genera
 *     description: Updates a genus
 *     parameters:
 *       - in: path
 *         name: genusId
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the genus
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Genus'
 *     responses:
 *       200:
 *         description: The updated genus
 *         schema:
 *           $ref: '#/components/schemas/Genus'
 *       400:
 *          description: Invalid param
 *       401:
 *          description: User is not an admin
 *       404:
 *          description: Genus does not exist
 *       500:
 *         description: Internal error
 */
export const updateGenus = async (req, res) => {
    try {
        const genus = await Genus.findByPk(req.params.genusId);
        if (!genus) {
            return res.status(404).send({ message: 'Genus does not exist' });
        }

        await genus.update({
            name: req.body.name,
            category: req.body.category,
        });
        return res.status(200).send(genus);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

/**
 * @swagger
 * /genera/{genusId}:
 *   delete:
 *     tags:
 *       - Genera
 *     description: Deletes a genus
 *     parameters:
 *       - in: path
 *         name: genusId
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the genus
 *     responses:
 *       200:
 *         description: The genus was deleted
 *       401:
 *          description: User is not an admin
 *       404:
 *          description: Genus does not exist
 *       500:
 *         description: Internal error
 */
export const deleteGenus = async (req, res) => {
    try {
        const genus = await Genus.findByPk(req.params.genusId);
        if (!genus) {
            return res.status(404).send({ message: 'Genus does not exist' });
        }

        await genus.destroy();
        return res.status(200).send({ message: 'Genus was deleted' });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
