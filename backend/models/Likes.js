module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define("Likes", {
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return Likes;
};
