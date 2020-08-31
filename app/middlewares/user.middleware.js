// eslint-disable-next-line import/prefer-default-export
export const checkUser = (req, res, next) => (req.session.userId === req.params.userId ? next()
    : res.status(401).send({ message: 'This userId does not exist' }));
