// eslint-disable-next-line import/prefer-default-export
export const getUser = async (req, res) => res.status(200).send({
    id: res.locals.user.id,
    username: res.locals.user.username,
    email: res.locals.user.email,
    roles: res.locals.roles,
});
