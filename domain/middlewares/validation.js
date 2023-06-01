const User = require("../../db/models/index").User;
module.exports = {
  register: async (req, res, next) => {
    try{
      let {nickname, email, password, passwordRepeat} = req.body;

      if (!nickname.match(/^[a-zA-Z0-9]{4,12}$/))
        throw new Error("Error.nicknameNotCorrect");
      if (!email.match(/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/))
        throw new Error("Error.emailNotCorrect");
      if ((await User.findAll({where:{email}})).length)
        throw new Error("Error.emailIsExist");
      if (!password.match(/^[a-zA-Z0-9]{8,16}$/))
        throw new Error("Error.passwordNotCorrect");
      if (password !== passwordRepeat)
        throw new Error("Error.passwordMatchRepeatPassword");
      next();
    }
    catch (error){
      res.status(400).json({message: error.message});
    }
  },
};