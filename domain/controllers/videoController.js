const userModel = require("#models/userModel");

module.exports = {
    Search: async (req, res, next) => {
        try {
            const users = await userModel.findByText(req?.params?.text);
            res.status(200).json({users});
        } catch (e) {
            next(e);
        }
    }
}