var validateEmail = function(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
};
var validateStringLength = function(str, length) {
    return (str.length >= length);
};
var validInteger = function (input) {
    if(input === undefined || input === null) {
        return false;
    }
    return ((parseInt(input)).toString() === input.toString() && input.toString().length < 9);
};

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

module.exports = {
    checkIfValidEmail: function (email, res) {
        if(!email || !validateEmail(email)) {
            var userResponse = {
                message: "Email provided is not a valid email",
                success: false
            };
            res.json(userResponse);
            return;
        }
        return true;
    },
    checkIfValidPassword: function (req, res, minLength) {
        if(!(req.query.password && validateStringLength(req.query.password, minLength))) {
            var userResponse = {
                message: "Password length not sufficient",
                success: false
            };
            res.json(userResponse);
            return;
        }
        return true;
    },
    checkIfValidInteger: function(res, data) {
        if(!validInteger(data)) {
            var userResponse = {
                message: "Invalid data provided. User not authorized",
                success: false
            };
            res.json(userResponse);
            return;
        }
        return true;
    },
    
    checkValidSearchParam: function(res, searchParam){
    	if(!(searchParam && /^[a-z0-9]*$/i.test(searchParam))){
    		var userResponse = {
                message: "Invalid data provided. User not authorized",
                success: false
            };
            res.json(userResponse);
            return;
    	}
    	return true;
    },
    
    // Used for validating filters coming from UI
    checkValidQueryParam: function(res, data){
    	if(!(data && /^[a-z0-9() ]*$/i.test(data))){
    		var userResponse = {
                message: "Invalid data provided. Please try again",
                success: false
            };
            res.json(userResponse);
            return;
    	}
    	return true;
    },
    
    checkOnlyNumbers: function(res, data) {
        if(!(data && /^[0-9]*$/i.test(data))){
    		var userResponse = {
                message: "Invalid data provided. Please try again",
                success: false
            };
            res.json(userResponse);
            return;
    	}
    	return true;
    },
    
    replaceAll: function(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }
};