
import jwt from "jsonwebtoken"
import User from "../model/UserModel.js";
export const SecureToken = async (req, res, next) => {
    try {
        let token = req.headers.authorization
         console.log(token);

        if (!token) { throw new Error("please require token") }
        let decode = jwt.verify(token, 'verifyuser')
        //   console.log("aaaa",decode);

        const usercheck = await User.findOne({ _id : decode.id});
        //  console.log(usercheck);

        if (!usercheck) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found or unauthorized'
            });
        }
        //  req.user = usercheck._id;
    req.user = usercheck;
        next();
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        })
    }
}

