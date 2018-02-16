import validator from 'validator'
var isEmpty = require('lodash/isEmpty');

export default function validateInputs(data) {
    let errors = {}
    if (validator.isEmpty(data.companyName)) {
        errors.companyName = 'Company Name is is required';
    }
    if (validator.isEmpty(data.email)) {
        errors.email = 'Email is required';
    }
    if (!validator.isEmail(data.email)) {
        errors.email = "Not a valid email";
    }
    if (validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }
    if (validator.isEmpty(data.passwordConfirmation)) {
        errors.passwordConfirmation = 'Password Confirmation is required';
    }
    if (!validator.equals(data.password, data.passwordConfirmation)) {
        errors.passwordConfirmation = "Passwords must match";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

