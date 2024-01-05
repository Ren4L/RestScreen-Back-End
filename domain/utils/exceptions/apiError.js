module.exports = class ApiError extends Error{
    constructor(statusCode, message, errors = [], component, obj) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.component = component;
        this.obj = obj;
    }

    static UnauthorizedError(){
        return new ApiError(401, "User not authorized", [], "[UserController]");
    }

    static BadRequest(errors = [], controller, obj){
        return new ApiError(400, "Incorrect data", errors, controller, obj);
    }
}