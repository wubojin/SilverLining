module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    course: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    schedule: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    availability: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Posts.associate = (models) => {
    Posts.hasMany(models.Likes, {
      onDelete: "cascade",
    });

    Posts.hasMany(models.Applications, {
      onDelete: "cascade",
    });
  };

  return Posts;
};
