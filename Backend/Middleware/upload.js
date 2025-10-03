import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'


    // Configuration
    cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });


    const UploadOnCloudinary=async (localFilePath)=>{
        try {
            if(!localFilePath) return null
            //upload thee file on cloudinary
            const response=await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })

            //file upload hogyi h ab kya kre
            console.log("FILE IS UPLOAADED ON CLOUDINARY",
            response.url);

            return response
        } catch (error) {
            fs.unlinkSync(localFilePath) //Remove the locally saved temp file as the upload got faailed
        }
    }
    
  