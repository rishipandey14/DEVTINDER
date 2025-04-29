const validator = require("validator");


const validateSignupData = (req) => {
    const { firstName, emailId, password } = req.body;

    if (!firstName ) {
        throw new Error("Name is not Valid")
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid Email")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Weak password")
    }
};

const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName", 
        "lastName", 
        "age", 
        "gender", 
        "photoUrl", 
        "about", 
        "skills",
    ];

    const isEditAllowed = Object.keys(req.body).every(key => allowedEditFields.includes(key));

    return isEditAllowed;
}

module.exports = {
    validateSignupData,
    validateEditProfileData
}