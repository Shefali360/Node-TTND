const error=require('./AdminErrors');
const CustomExceptions=require("../ExceptionModel");


class UnauthorizedAccess extends CustomExceptions{
    constructor(message,responseCode,payload){
    super(message,error.unauthorizedAccess,responseCode,payload);
    this.name="UnauthorizedAccessError";
    this.stack=`${this.message}\n${new Error().stack}`
    }
}

module.exports={UnauthorizedAccess};