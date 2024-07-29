module.exports = (sequelize, DataTypes) => {
  const Messages = sequelize.define("Messages", {
    messageBody: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Messages;
};
