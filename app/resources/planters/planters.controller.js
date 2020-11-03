import db from '../../models/models';

const { Planter, Planting } = db;
/**
 * @swagger
 * /planters:
 *   post:
 *     tags:
 *       - Planters
 *     description: Creates a planter
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Planter'
 *     responses:
 *       201:
 *         description: The created planter
 *         schema:
 *           $ref: '#/components/schemas/Planter'
 *       400:
 *          description: Invalid param
 *       500:
 *         description: Internal error
 */
export const addPlanter = async (req, res) => {
    try {
        const planter = await res.locals.user.createPlanter({
            name: req.body.name,
            shape: req.body.shape,
            position: req.body.position,
            dimensions: req.body.dimensions,
            color: req.body.color,
            exposure: req.body.exposure,
        });
        return res.status(201).send({ ...planter.dataValues, plantings: [] });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

/**
 * @swagger
 * /planters:
 *   get:
 *     tags:
 *       - Planters
 *     description: Lists a user's planters
 *     responses:
 *       200:
 *         description: The list of planters
 *         schema:
 *           $ref: '#/components/schemas/Planters'
 *       500:
 *         description: Internal error
 */
export const getAllPlanters = async (req, res) => {
    try {
        const planters = await res.locals.user.getPlanters({ include: [{ model: Planting, as: 'plantings' }] });
        res.status(200).send(planters);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

/**
 * @swagger
 * /planters/{planterId}:
 *   put:
 *     tags:
 *       - Planters
 *     description: Updates a user's planter
 *     parameters:
 *       - in: path
 *         name: planterId
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the planter
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Planter'
 *     responses:
 *       200:
 *         description: The updated planter
 *         schema:
 *           $ref: '#/components/schemas/Planter'
 *       400:
 *          description: Invalid param
 *       401:
 *          description: Planter does not belong to this user
 *       404:
 *          description: Planter does not exist
 *       500:
 *         description: Internal error
 */
export const updatePlanter = async (req, res) => {
    try {
        const planter = await Planter.findByPk(req.params.planterId);
        if (!planter) {
            return res.status(404).send({ message: 'Planter does not exist' });
        }

        const belongs = await res.locals.user.hasPlanter(planter);
        if (!belongs) {
            return res.status(401).send({ message: 'You cannot edit this planter' });
        }

        await planter.update({
            name: req.body.name,
            shape: req.body.shape,
            position: req.body.position,
            dimensions: req.body.dimensions,
            color: req.body.color,
            exposure: req.body.exposure,
        });
        return res.status(200).send(planter);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

/**
 * @swagger
 * /planters/{planterId}:
 *   delete:
 *     tags:
 *       - Planters
 *     description: Deletes a planter
 *     parameters:
 *       - in: path
 *         name: planterId
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the planter
 *     responses:
 *       200:
 *         description: The planter was deleted
 *       401:
 *          description: Planter belongs to another user
 *       404:
 *          description: Planter does not exist
 *       500:
 *         description: Internal error
 */
export const deletePlanter = async (req, res) => {
    try {
        const planter = await Planter.findByPk(req.params.planterId);
        if (!planter) {
            return res.status(404).send({ message: 'Planter does not exist' });
        }

        const belongs = await res.locals.user.hasPlanter(planter);
        if (!belongs) {
            return res.status(401).send({ message: 'You cannot delete this planter' });
        }

        await planter.destroy();
        return res.status(200).send({ message: 'Planter was deleted' });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
