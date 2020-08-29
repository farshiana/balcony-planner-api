import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from '../config/db.config';
import { ROLES } from '../constants';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];
const db = {};

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

fs.readdirSync(__dirname)
    .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach((file) => {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const model = require(path.join(__dirname, file)).default(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db.role.belongsToMany(db.user, {
//     through: "user_roles",
//     foreignKey: "roleId",
//     otherKey: "userId"
//   });
//   db.user.belongsToMany(db.role, {
//     through: "user_roles",
//     foreignKey: "userId",
//     otherKey: "roleId"
//   });

db.ROLES = ROLES;

export default db;
