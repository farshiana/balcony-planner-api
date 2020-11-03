/**
 * @swagger
 * /balconies/{balconyId}:
 *   put:
 *     tags:
 *       - Balconies
 *     description: Updates a user's balcony
 *     parameters:
 *       - in: path
 *         name: balconyId
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the balcony
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Balcony'
 *     responses:
 *       200:
 *         description: The updated balcony
 *         schema:
 *           $ref: '#/components/schemas/Balcony'
 *       400:
 *          description: Invalid param
 *       401:
 *          description: Balcony belongs to another user
 *       404:
 *          description: Balcony does not exist
 *       500:
 *         description: Internal error
 */
// eslint-disable-next-line import/prefer-default-export
export const updateBalcony = async (req, res) => {
    try {
        const balcony = await res.locals.user.getBalcony();
        if (!balcony) {
            return res.status(404).send({ message: 'Balcony is missing' });
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
