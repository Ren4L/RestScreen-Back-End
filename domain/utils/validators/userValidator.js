const Validator = require("./validator");

module.exports = class UserValidator extends Validator {
    constructor(data, checks) {
        super(data, checks);
    }

    email(email){
        if (!email.match(/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/))
            this.errors.push("Error.emailNotCorrect");
    }

    nickname(nickname){
        if (!nickname.match(/^[a-zA-Z0-9]{4,12}$/))
            this.errors.push("Error.nicknameNotCorrect");
    }

    password(password){
        if (!password.match(/^[a-zA-Z0-9]{8,16}$/))
            this.errors.push("Error.passwordNotCorrect");
    }

    passwordCompare(password, passwordRepeat){
        if (password !== passwordRepeat)
            this.errors.push("Error.repeatPassNotCorrect");
    }
}