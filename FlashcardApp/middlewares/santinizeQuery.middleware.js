module.exports = (req, res, next) => {
    const {word} = req.query;

    // Regex check Xss
    if(word && /[<>$'";]/.test(word)){
        return res.status(400).json({message: "Malicious query rejected"});
    }

    req.query.word = String(word).trim().replace(/[$]/g, ""); // Reject harmful character;
    next();
}