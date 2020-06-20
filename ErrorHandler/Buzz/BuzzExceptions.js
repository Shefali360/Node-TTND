const error=require('./BuzzErrors');
const CustomExceptions=require("../ExceptionModel");


class DataValidationFailed extends CustomExceptions{
    constructor(message,responseCode,payload){
    super(message,error.dataValidationFailed,responseCode,payload);
    this.name="DatavalidationFailedError";
    this.stack=`${this.message}\n${new Error().stack}`
    }
}

class InvalidFileFormat extends CustomExceptions{
    constructor(message,responseCode,payload){
        super(message,error.invalidFileFormat,responseCode,payload);
        this.name="DatavalidationFailedError";
        this.stack=`${this.message}\n${new Error().stack}`
        }
}

module.exports={DataValidationFailed,InvalidFileFormat};