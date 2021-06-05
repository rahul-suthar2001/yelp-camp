const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API,
    api_secret: process.env.CLOUD_API_KEY
});

const storage  = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: 'yelp-camp',
        allowedFormats : ['jpeg' , 'jpg' , 'png']
    }
})

module.exports = {
    cloudinary,
    storage
}