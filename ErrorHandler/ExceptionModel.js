class CustomExceptions extends Error {
    constructor(message, code, responseCode, payload) {
        super(message);
        this.code = code;
        this.responseCode = responseCode;
        this.payload = payload || {};
    }
}

module.exports=CustomExceptions;