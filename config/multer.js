import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';

// Amb ES Modules no existeix __dirname; es construeix des de import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// IMPORTANT: coincideix amb la que crea index.js → /uploads/perfiles
// Carpeta donde se guardan las imagenes de cervezas y vinos.
// Luego index.js la expone publicamente con app.use('/uploads', express.static(...)).
// Desde /config subimos un nivel hasta la raiz de la API: CanoJoel_API/uploads/productos.
const dest = path.join(__dirname, '../uploads/productos');

// Crea la carpeta si no existe para que la primera subida no falle.
fs.mkdirSync(dest, { recursive: true });

// diskStorage: guardar a disc; destination = carpeta, filename = nom del fitxer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // Nombre unico y sin espacios para evitar colisiones y URLs problematicas.
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
