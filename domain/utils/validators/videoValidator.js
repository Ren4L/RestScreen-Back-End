const Validator = require("./validator");

module.exports = class VideoValidator extends Validator {
    constructor(data, checks) {
        super(data, checks);
    }

    description(description){
        if (typeof description !== "string")
            !this.errors.includes("Error.notString") ? this.errors.push("Error.notString") : this.errors;
        else if (!description.match(/^[а-яА-Яa-zA-Z0-9\s?!,.'"Ёё():;]{8,300}$/))
            this.errors.push("Error.descriptionNotCorrect");
    }

    title(title){
        if (typeof title !== "string")
            !this.errors.includes("Error.notString") ? this.errors.push("Error.notString") : this.errors;
        else if (!title.match(/^[а-яА-Яa-zA-Z0-9\s?!,.'"Ёё():;]{5,35}$/))
            this.errors.push("Error.titleNotCorrect");
    }

    category(category){
        if (typeof category !== "number")
            !this.errors.includes("Error.notNumber") ? this.errors.push("Error.notNumber") : this.errors;
        else if (category < 0)
            this.errors.push("Error.categoryNotCorrect");
    }

    fileNotNull(obj){
        if (typeof obj === "undefined" || obj === null)
            this.errors.push("Error.fileNotCorrect");
    }
}