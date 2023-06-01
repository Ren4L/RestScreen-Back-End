const userModel = require("../models/userModel");
module.exports = {
    create: async (req, res) => {
        let salt = Math.round(100 - 0.5 + Math.random() * (1000 - 100 + 1));
        let response = await userModel.create({...req.body, salt});
        if (response.flag)
            res.status(201).json(response);
        else
            res.status(500).json(response);
    }
};