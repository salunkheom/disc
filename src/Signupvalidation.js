export default function Signupvalidation(values) {
    let errors = {};
   

    if (!values.name) {
        errors.name = "Name is required";
    } else {
        errors.name = "";
    }

    // No lastName validation as it's removed

    if (!values.email) {
        errors.email = "Email is required";
    } else {
        errors.email = "";
    }

    if (!values.password) {
        errors.password = "Password is required";
    }else {
        errors.password = "";
    }

    return errors;
}