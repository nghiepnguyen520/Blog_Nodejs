'use strict'
module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define('Blog', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {})
  Blog.associate = function (models) {
    // associations can be defined here
    Blog.hasMany(models.Tag, {
      foreignKey: 'blogId',
      as: 'tags'
    })
    Blog.belongsTo(models.Category, {
      foreignKey: 'caterogyId',
      onDelete: 'CASCADE'
    })
  }
  return Blog
}
