const allowRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // userAuth must run before this
        if (!req.user) {
            res.status(401);
            throw new Error("Not authorized");
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403);
            throw new Error(
                `Access denied. Role '${req.user.role}' is not allowed`
            );
        }

        next();
    };
};

export default allowRoles;
