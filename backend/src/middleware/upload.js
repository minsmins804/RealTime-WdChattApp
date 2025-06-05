
import multer from "multer";

const storage = multer.memoryStorage(); // giữ trong RAM
const upload = multer({ storage });

export default upload;
