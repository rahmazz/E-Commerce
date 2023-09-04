import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, `../../config/.env`) });
import { v2 as cloudinary } from "cloudinary";


cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:   process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});
export default cloudinary;



// const imagArr = product.coverImages
// const ids = imagArr.map((image) => image.public_id)

//add the public_id of the defaultImage too 
// ids.push(product.defaultImage.public_id)

//delete coverImages
//const deletedResult = await cloudinary.api.delete_resources(ids)

//delete folder
////const deletedResult = await cloudinary.api.delete_folder(`${process.env.FOLDER_CLOUD_NAME}/product/coverImages`)
