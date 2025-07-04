function Loginvalidation(values) {
    let errors = {};
    // Corrected email regex: single backslashes for \s and \.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Corrected password regex: single backslash for \d
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    // Log the password value being validated for debugging
    console.log("Password received for validation:", values.password);

    if (!values.email) {
        errors.email = "Email is required";
    } else if (!emailRegex.test(values.email)) {
        errors.email = "Email is invalid";
    } else {
        errors.email = "";
    }

    if (!values.password) {
        errors.password = "Password is required";
    } else {
        // Trim whitespace from password before testing
        const trimmedPassword = values.password.trim();
        console.log("Trimmed password for validation:", trimmedPassword);
        if (!passwordRegex.test(trimmedPassword)) {
            // Log the regex test result for debugging
            console.log("Password regex test result (false):", trimmedPassword);
            errors.password = "Password must be at least 6 characters, with at least one letter and one number.";
        } else {
            console.log("Password regex test result (true):", trimmedPassword);
            errors.password = "";
        }
    }

    return errors;
}
export default Loginvalidation;