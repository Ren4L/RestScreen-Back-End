const VideoCategory = require("#db/models/index").VideoCategory;
module.exports = {
    getAll: async () => {
        return (await VideoCategory.findAll());
    }
};