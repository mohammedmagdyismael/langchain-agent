import { Request, Response, NextFunction } from "express";

const userKeyValidation = (req: Request, res: Response, next: NextFunction) => {
    if (!(req.query.key || req.body.key)) {
        return res.status(400).json({ error: "Missing 'key'" });
    }

    next();
};

export default userKeyValidation;
