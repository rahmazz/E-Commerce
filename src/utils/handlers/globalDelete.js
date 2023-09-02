import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ErrorClass } from "../errorClass.js";
import cloudinary from "../cloudinary.js";


export const deleteOne = (model) =>{
    return async (req, res, next) => {
        const { id } = req.params;
        const isExist = await model.findByIdAndDelete(id);
        if (!isExist) {
            return next(new ErrorClass("not exist" , StatusCodes.NOT_FOUND));
        }
        if (isExist.image) {
            await cloudinary.uploader.destroy(isExist.image.public_id);
        }
        if (isExist.coverImages) {
            for (let i = 0; i < isExist.coverImages.length; i++) {
                await cloudinary.uploader.destroy(isExist.coverImages[i].public_id);                
            }
        }
        return res.status(StatusCodes.OK).json({ message: "Done", isExist ,status:ReasonPhrases.OK});
        };
}