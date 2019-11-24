'use strict'
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: DataTypes.STRING
  }, {})
  Category.associate = function (models) {
    // associations can be defined here
    Category.hasMany(models.Blog, {
      foreignKey: 'caterogyId',
      as: 'blogs'
    })
  }
  return Category
}
