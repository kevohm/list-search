class CustomError extends Error{
    constructor(msg, code) {
        this.message = msg;
        this.statusCode = code;
    }
    static createCustomError(msg, code) {
        this.message = msg;
        this.statusCode = code;
    }
}

module.exports = CustomError;
