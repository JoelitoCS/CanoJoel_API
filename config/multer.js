import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

// Amb ES Modules no existeix __dirname; es construeix des de import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta correcta on es guardaran els fitxers pujats
// IMPORTANT: coincideix amb la que crea index.js → /uploads/perfiles
const dest = path.join(__dirname, '../../uploads/perfiles');

// diskStorage: guardar a disc; destination = carpeta, filename = nom del fitxer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + (file.originalname || 'fitxer');
    cb(null, unique.replace(/\s/g, '-'));
  }
});

// fileFilter: rebutjar fitxers que no siguin imatges (seguretat)
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/i.test(file.mimetype);
  if (allowed) {
    cb(null, true);
  } else {
    cb(new Error('Tipus de fitxer no permès. Només imatges.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }  // 5 MB màxim
});

export default upload;
