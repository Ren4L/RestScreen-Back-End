const User = require("../../db/models/index").User;
const bcrypt = require('bcrypt');
module.exports = {
    create: async ({nickname, email, password, salt}) => {
        try{
            await User.create({
                nickname, email, salt,
                password: await bcrypt.hash(password + salt, await bcrypt.genSalt(10)),
            })
            return {flag: true}
        }
        catch (error){
            return {flag: false, message: error.message}
        }
    },
};