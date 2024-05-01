const Validator = require("./validator");

module.exports = class UserValidator extends Validator {
    constructor(data, checks) {
        super(data, checks);
    }

    nickname(nickname){
        if (typeof nickname !== "string")
            !this.errors.includes("Error.notString") ? this.errors.push("Error.notString") : this.errors;
        else if (!nickname.match(/^[a-zA-Z0-9]{4,12}$/))
            this.errors.push("Error.nicknameNotCorrect");
    }

    password(password){
        if (typeof password !== "string")
            !this.errors.includes("Error.notString") ? this.errors.push("Error.notString") : this.errors;
        else if (!password.match(/^[a-zA-Z0-9]{8,16}$/))
            this.errors.push("Error.passwordNotCorrect");
    }

    passwordCompare(password, passwordRepeat){
        if (password !== passwordRepeat)
            this.errors.push("Error.repeatPassNotCorrect");
    }

    description(description){
        if (typeof description !== "string")
            !this.errors.includes("Error.notString") ? this.errors.push("Error.notString") : this.errors;
        else if (!description.match(/^[а-яА-Яa-zA-Z0-9\s?!,.'"Ёё():;]{8,}$/))
            this.errors.push("Error.editDescription");
    }

    code(code){
        if (typeof code !== "number")
            !this.errors.includes("Error.notNumber") ? this.errors.push("Error.notNumber") : this.errors;
        else if (code <= 9999 || code >= 99999)
            this.errors.push("Error.codeNotCorrect");
    }
}