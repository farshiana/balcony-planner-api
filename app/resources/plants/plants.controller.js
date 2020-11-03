import db from '../../models/models';

const { Plant, Variety } = db;

/**
 * @swagger
 * /plants:
 *   post:
 *     tags:
 *       - Plants
 *     description: Creates a plant
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Plant'
 *     responses:
 *       201:
 *         description: The created plant
 *         schema:
 *           $ref: '#/components/schemas/Plant'
 *       400:
 *          description: Invalid param
 *       500:
 *         description: Internal error
 */
export const addPlant = async (req, res) => {
    try {
        const variety = await Variety.findByPk(req.body.varietyId);
        if (!variety) {
            return res.status(404).send({ message: 'Variety does not exist' });
        }

        const plant = await Plant.create({
            userId: res.locals.user.id,
            varietyId: req.body.varietyId,
            notes: req.body.notes,
        });
        return res.status(201).send(plant);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

/**
 * @swagger
 * /plants:
 *   get:
 *     tags:
 *       - Plants
 *     description: Lists a user's plants
 *     responses:
 *       200:
 *         description: The list of plants
 *         schema:
 *           $ref: '#/components/schemas/Plants'
 *       500:
 *         description: Internal error
 */
export const getAllPlants = async (req, res) => {
    try {
        const plants = await Plant.findAll({
            where: { userId: res.locals.user.id },
            include: [{ model: Variety, as: 'variety' }],
            order: [[{ model: Variety, as: 'variety' }, 'name']],
        });
        res.status(200).send(plants);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

/**
 * @swagger
 * /plants/{plantId}:
 *   put:
 *     tags:
 *       - Plants
 *     description: Updates a user's plant
 *     parameters:
 *       - in: path
 *         name: plantId
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the plant
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Plant'
 *     responses:
 *       200:
 *         description: The updated plant
 *         schema:
 *           $ref: '#/components/schemas/Plant'
 *       400:
 *          description: Invalid param
 *       401:
 *          description: Plant does not belong to this user
 *       404:
 *          description: Plant does not exist
 *       500:
 *         description: Internal error
 */
export const updatePlant = async (req, res) => {
    try {
        const plant = await Plant.findByPk(req.params.plantId);
        if (!plant) {
            return res.status(404).send({ message: 'Plant does not exist' });
        }

        const belongs = await res.locals.user.hasPlant(plant);
        if (!belongs) {
            return res.status(401).send({ message: 'You cannot edit this plant' });
        }

        await plant.update({ notes: req.body.notes });
        return res.status(200).send(plant);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

/**
 * @swagger
 * /plants/{plantId}:
 *   delete:
 *     tags:
 *       - Plants
 *     description: Deletes a plant
 *     parameters:
 *       - in: path
 *         name: plantId
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the plant
 *     responses:
 *       200:
 *         description: The plant was deleted
 *       401:
 *          description: Plant belongs to another user
 *       404:
 *          description: Plant does not exist
 *       500:
 *         description: Internal error
 */
export const deletePlant = async (req, res) => {
    try {
        const plant = await Plant.findByPk(req.params.plantId);
        if (!plant) {
            return res.status(404).send({ message: 'Plant does not exist' });
        }

        const belongs = await res.locals.user.hasPlant(plant);
        if (!belongs) {
            return res.status(401).send({ message: 'You cannot delete this plant' });
        }

        await plant.destroy();
        return res.status(200).send({ message: 'Plant was deleted' });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
