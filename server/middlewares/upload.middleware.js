import multer from "multer";
import path from "path";

// הגדרת איפה לשמור את הקבצים
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
      // שם ייחודי לקובץ
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  // פילטר: רק קבצי תמונה
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("אפשר להעלות רק תמונות"), false);
    }
  };
  
  const upload = multer({ storage, fileFilter });
  
  export default upload;