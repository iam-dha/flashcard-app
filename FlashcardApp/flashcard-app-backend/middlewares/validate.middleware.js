module.exports.validatePassword = (passwordList = []) => {
    return async (req, res, next) => {
        for(const field of passwordList){
            const password = req.body[field];
            // Move to check required Fields
            if(!password){
                return res.status(400).json({message: `Missing required field: ${field}`});
            }
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
            if(!passwordRegex.test(password)){
                return res.status(400).json({message: `Password field '${field}' must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters`});
            }
        }
        next();
    };
};