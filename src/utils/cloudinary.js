import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
    cloud_name: "dfv2awqlw", 
    api_key: 824117843184369, 
    api_secret: 'BG9T9Eu93rKkSK6_vLtm_d6kvCo'
  });

// cloudinary.config({ 
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_API_SECRET 
// });

const uploadOnCloudinary = async (localFilePath) => {
    try {

        if (!localFilePath) {
         console.log("did not get local file path")
            return null
        }
        console.log("LOCAL FILE PATH ==",localFilePath);
            //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.log("ERROR IN UPLOADING FILE==",error)
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}



export {uploadOnCloudinary}