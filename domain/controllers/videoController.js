const userModel = require("#models/userModel");
const videoCategoryModel = require('#models/videoCategoryModel');
module.exports = {
    Search: async (req, res, next) => {
        try {
            const users = await userModel.findByText(req?.params?.text);
            res.status(200).json({users});
        } catch (e) {
            next(e);
        }
    },
    getCategory: async (req, res, next) => {
        try {
            const category = await videoCategoryModel.getAll();
            console.log(category)
            res.status(200).json(category);
        } catch (e) {
            next(e);
        }
    }
}