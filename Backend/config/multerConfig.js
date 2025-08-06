import multer from 'multer';

const storage = multer.memoryStorage(); // store file in memory as Buffer
const upload = multer({ storage });

export default upload;
