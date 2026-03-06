const verifiedUser = (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401);
            throw new Error("Not authorized");
        }

        if (!req.user.isAccountVerified) {
            res.status(403);
            throw new Error("Account is not verified");
        }

        next();
    } catch (error) {
        next(error);
    }
};

export default verifiedUser;
