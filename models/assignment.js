const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

class Assignment extends Model {}

Assignment.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    file_content: {
        type: DataTypes.BLOB // Assuming you're storing file content as a binary large object (BLOB)
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Assignment'
});

module.exports = Assignment;
