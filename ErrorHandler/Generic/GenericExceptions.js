const error=require("./GenericErrors");
const CustomExceptions=require("../ExceptionModel");

class ResourceNotFound extends CustomExceptions {

    constructor(message, responseCode, payload) {
        super(message, error.notFound, responseCode, payload);
        this.name = 'ResourceNotFoundError';
        this.stack = `${this.message}\n${new Error().stack}`;
    }
}

class ServerError extends CustomExceptions {
    constructor(message, responseCode, payload) {
        super(message, error.serverError, responseCode, payload);
        this.name = 'ServerError';
        this.stack = `${this.message}\n${new Error().stack}`;
    }
}


class ActionNotAcceptable extends CustomExceptions {
    constructor(message, responseCode, payload) {
        super(message, error.actionNotAcceptable, responseCode, payload);
        this.name = 'ActionNotAcceptableError';
        this.stack = `${this.message}\n${new Error().stack}`;
    }
}

module.exports={ResourceNotFound,ServerError,ActionNotAcceptable};