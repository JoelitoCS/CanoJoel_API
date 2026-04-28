// ============================================
// EJEMPLO CORRECTO DE COMPONENTE REGISTRO
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    foto: null  // IMPORTANTE: null, no string
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ URL BASE - CAMBIA ESTO CON TU DOMINIO
  const API_URL = 'http://localhost:3000'; // Local
  // const API_URL = 'https://tu-api-publicada.com'; // Producción

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      // IMPORTANTE: Guardar el archivo, no el string
      setFormData({
        ...formData,
        [name]: files[0] || null
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validar campos
      if (!formData.email || !formData.password) {
        throw new Error('Email y contraseña son requeridos');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      // ✅ CREAR FORMDATA (IMPORTANTE)
      const form = new FormData();
      form.append('nombre', formData.nombre);
      form.append('email', formData.email);
      form.append('password', formData.password);
      
      // Añadir foto si existe
      if (formData.foto) {
        form.append('foto', formData.foto);
      }

      console.log('📤 Enviando solicitud a:', `${API_URL}/api/auth/registro`);
      console.log('📸 Foto:', formData.foto ? formData.foto.name : 'Sin foto');

      // ✅ SOLICITUD SIN HEADER Content-Type
      // El navegador establece Content-Type automáticamente con FormData
      const response = await fetch(`${API_URL}/api/auth/registro`, {
        method: 'POST',
        body: form, // ✅ Pasar FormData directamente
        // NO incluir headers: Content-Type se establece automáticamente
      });

      console.log('📊 Status:', response.status);

      if (!response.ok) {
        const data = await response.json();
        console.error('❌ Error:', data);
        throw new Error(data.error || `Error ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Éxito:', data);

      // Guardar token y usuario
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuari));

      // Redirigir
      navigate('/');

    } catch (err) {
      console.error('❌ Error en registro:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear acceso</h2>
      
      {error && (
        <div style={{ color: 'red', padding: '10px', marginBottom: '10px' }}>
          ❌ {error}
        </div>
      )}

      <div>
        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Tu nombre (opcional)"
        />
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@email.com"
          required
        />
      </div>

      <div>
        <label>Contraseña</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••"
          required
        />
      </div>

      <div>
        <label>Confirmar contraseña</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••"
          required
        />
      </div>

      <div>
        <label>Foto de perfil</label>
        <input
          type="file"
          name="foto"
          onChange={handleChange}
          accept="image/jpeg,image/png,image/webp,image/gif"
        />
        {formData.foto && (
          <p style={{ color: 'green' }}>✅ {formData.foto.name}</p>
        )}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>

      <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
    </form>
  );
}

export default Registro;

/**
 * 🔧 PUNTOS CLAVE:
 * 
 * 1. ✅ Usar new FormData() para multipart/form-data
 * 2. ✅ NO incluir header Content-Type (el navegador lo hace automáticamente)
 * 3. ✅ Guardar el archivo en formData.foto (objeto File, no string)
 * 4. ✅ Usar fetch(..., { method: 'POST', body: form })
 * 5. ✅ Cambiar API_URL según sea local o producción
 * 6. ✅ Verificar que el servidor esté escuchando en el puerto correcto
 * 
 * 🐛 PROBLEMAS COMUNES:
 * - Si pones Content-Type: 'multipart/form-data' en headers, falla (el navegador no agrega boundary)
 * - Si envías JSON en lugar de FormData, falla
 * - Si la URL está mal, recibirás ERR_CONNECTION_CLOSED
 */
