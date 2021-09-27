module.exports.registerValidation = (username , password) =>{

    const erroors =[];

    if(username ==="" ){
        erroors.push({message :"Please fill the username"});
    }
    if(password ==="" ){
        erroors.push({message :"Please fill the password"});
    }
   
    return erroors;
}