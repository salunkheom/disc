export default function Signupvalidation(values) {
    let errors = {};
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    // Password regex: At least 6 characters, at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$/;

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