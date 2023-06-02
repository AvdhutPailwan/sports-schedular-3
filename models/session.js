"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static async getAllSessions() {
      return await this.findAll();
    }

    static async createSession({ time, place, players, noOfPlayers }) {
      return this.create({
        time,
        place,
        players: players.split(","),
        noOfPlayers,
      });
    }

    static async deleteSession(id) {
      return await this.destroy({
        where: {
          id,
        },
      });
    }
  }
  Session.init(
    {
      time: DataTypes.DATE,
      place: DataTypes.STRING,
      players: DataTypes.ARRAY(DataTypes.STRING),
      noOfPlayers: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Session",
    }
  );
  return Session;
};
