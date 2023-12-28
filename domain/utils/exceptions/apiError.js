module.exports = class ApiError extends Error{
    constructor(statusCode, message, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
    }

    static UnauthorizedError(){
        return new ApiError(401, "User not authorized");
    }

    static BadRequest(errors = []){
        return new ApiError(400, "Incorrect data", errors);
    }
}