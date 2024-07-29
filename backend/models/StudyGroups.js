module.exports = (sequelize, DataTypes) => {
  const StudyGroups = sequelize.define("StudyGroups", {
    groupname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    objective: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  StudyGroups.associate = (models) => {
    StudyGroups.hasMany(models.Messages, {
      onDelete: "cascade",
    });
  };

  return StudyGroups;
};
