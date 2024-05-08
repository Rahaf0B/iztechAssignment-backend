
import ImageKit from "imagekit";
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";

const upload = multer({ storage:multer.memoryStorage()}).single('image');
const imagekit = new ImageKit({
      publicKey: process.env.PUBLICKEY,
      privateKey: process.env.PRIVATEKEY,
      urlEndpoint: process.env.URLENDPOINT,
    });


    export default  imagekit;