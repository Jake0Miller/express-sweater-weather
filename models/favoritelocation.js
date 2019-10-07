'use strict';
module.exports = (sequelize, DataTypes) => {
  const FavoriteLocation = sequelize.define('FavoriteLocation', {
    user_id: DataTypes.INTEGER,
    location_id: DataTypes.INTEGER
  }, {});
  FavoriteLocation.associate = function(models) {
    // associations can be defined here
  };
  return FavoriteLocation;
};