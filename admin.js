// admin.js (en la raíz, junto a index.js)
import 'dotenv/config';
import mongoose from 'mongoose';
import Usuario from './modelos/modeloUsuarios.js';

const EMAIL = 'admin@vinacoteca.com';
const PASSWORD = 'admin123';
const NOMBRE = 'Administrador';

async function crearAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connectat a MongoDB');

    const existent = await Usuario.findOne({ email: EMAIL });

    if (existent) {
      if (existent.rol !== 'admin') {
        existent.rol = 'admin';
        await existent.save();
        console.log('👑 Usuari promocionat a admin:', existent.email);
      } else {
        console.log('ℹ️  Ja existeix un admin amb aquest email:', existent.email);
      }
      await mongoose.disconnect();
      process.exit(0);
    }

    const admin = new Usuario({
      nombre: NOMBRE,
      email: EMAIL,
      password: PASSWORD,
      rol: 'admin'
    });

    await admin.save();

    console.log('🎉 Admin creat correctament!');
    console.log('   Email   :', EMAIL);
    console.log('   Password:', PASSWORD);
    console.log('   Rol     :', admin.rol);

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

crearAdmin();