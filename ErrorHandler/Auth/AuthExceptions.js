const error=require('./AuthErrors');
const CustomExceptions=require("../ExceptionModel");


class invalidTokenCodeError extends CustomExceptions{
    constructor(message,responseCode,payload){
    super(message,error.invalidTokenCode,responseCode,payload);
    this.name="InvalidTokenGrantCodeError";
    this.stack=`${this.message}\n${new Error().stack}`
    }
}

class invalidTokenError extends CustomExceptions{
    constructor(message,responseCode,payload){
        super(message,error.invalidTokenError,responseCode,payload);
        this.name="InvalidTokenError";
        this.stack=`${this.message}\n${new Error().stack}`
        }
}
 
class authHeadersAbsent extends CustomExceptions{
    constructor(message,responseCode,payload){
        super(message,error.authTokenAbsent,responseCode,payload);
        this.name="AuthTokenAbsent";
        this.stack=`${this.message}\n${new Error().stack}`
        }
}
 
class invalidAuthHeaderFormat extends CustomExceptions{
    constructor(message,responseCode,payload){
        super(message,error.invalidAuthHeaderFormat,responseCode,payload);
        this.name="InvalidAuthHeaderFormat";
        this.stack=`${this.message}\n${new Error().stack}`
        }
}
 
class authTokenAbsent extends CustomExceptions{
    constructor(message,responseCode,payload){
        super(message,error.authTokenAbsentr,responseCode,payload);
        this.name="AuthTokenAbsent";
        this.stack=`${this.message}\n${new Error().stack}`
        }
}
 
module.exports={invalidTokenCodeError,invalidTokenError
,authHeadersAbsent,invalidAuthHeaderFormat,authTokenAbsent};