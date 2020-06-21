const error=require('./ValidationErrors');
const CustomExceptionTemplate=require("../ExceptionModel");

class RequiredFieldAbsent extends CustomExceptionTemplate {
    constructor(message, responseCode, payload) {
        super(message,error.requiredFieldAbsent, responseCode, payload);
        this.name = 'RequiredFieldAbsentError';
        this.stack = `${this.message}\n${new Error().stack}`;
    }
}

class DuplicateKey extends CustomExceptionTemplate {
    constructor(message, responseCode, payload) {
        super(message,error.duplicateKeyError, responseCode, payload);
        this.name = 'DuplicateKeyError';
        this.stack = `${this.message}\n${new Error().stack}`;
    }
}

module.exports={RequiredFieldAbsent,DuplicateKey};