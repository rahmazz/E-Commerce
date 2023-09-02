import * as userController from "./controller/user.js"
import { Router } from "express"
const router = Router()
import {auth} from "../../middleWare/authontication.js"
import { validation } from "../../middleWare/validation.js";
import * as validatores from "./validation.js"
import { fileUpload , fileValidation } from "../../utils/multer.cloud.js";


router.get(`/`,validation(validatores.userprofile),auth,userController.userProfile)
router.put(`/changepassword`,validation(validatores.changepassword),auth,userController.changePassword)
router.put(`/update`,validation(validatores.update),auth,userController.updateUser)
router.delete(`/delete`,validation(validatores.deleteuser),auth,userController.deleteUser)
router.put(`/softdelete`,validation(validatores.softdeleteuser),auth,userController.softDelete)
router.put(`/logout`,validation(validatores.logout),auth,userController.logout)

router.patch(`/profile/image`,
auth,
fileUpload(fileValidation.image).single('image'),
userController.profileImage
)

router.patch(`/profile/cover/image`,
auth,
fileUpload(fileValidation.image).array('image' , 5),
userController.profileCoverImages
)


export default router







//disk storage router
// import { fileUpload , fileValidation } from "../../utils/multer.js";


// router.patch(`/profile/image`,
// auth,
// fileUpload(`/user/profile`,[fileValidation.image]).single('image'),//'image' is the name of the front-end input <form type="file" name="image"></form>
// userController.profileImage
// )

// router.patch(`/profile/cover/image`,
// auth,
// fileUpload(`/user/cover`,fileValidation.allowMimeType).array('image' , 5),
// userController.profileCoverImages
// )
