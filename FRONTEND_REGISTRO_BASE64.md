# Instrucciones para modificar el Frontend - Registro con Base64

## Cambios necesarios en `Registro.jsx`

El backend ahora espera recibir la foto como **Base64 en el JSON**, no como FormData.

### 1. Función para convertir archivo a Base64

Añade esta función en tu componente Registro:

```javascript
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
```

### 2. Modificar el handleChange para archivos

Si tienes un input de tipo file:

```javascript
const handleChange = async (e) => {
  const { name, value, type, files } = e.target;
  
  if (type === 'file' && files[0]) {
    try {
      const base64 = await fileToBase64(files[0]);
      setFormData({
        ...formData,
        [name]: base64  // Guardar como Base64
      });
    } catch (error) {
      console.error('Error al convertir imagen:', error);
    }
  } else {
    setFormData({
      ...formData,
      [name]: value
    });
  }
};
```

### 3. Modificar la petición POST

En lugar de usar FormData, envía un JSON normal:

**ANTES (FormData):**
```javascript
const formData = new FormData();
formData.append('email', datos.email);
formData.append('password', datos.password);
formData.append('nombre', datos.nombre);
if (datos.foto) formData.append('foto', datos.foto);

const response = await fetch('https://tu-api.com/api/auth/registro', {
  method: 'POST',
  body: formData  // ❌ NO usar FormData
});
```

**DESPUÉS (JSON):**
```javascript
const response = await fetch('https://tu-api.com/api/auth/registro', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'  // ✅ JSON, no FormData
  },
  body: JSON.stringify({
    email: datos.email,
    password: datos.password,
    nombre: datos.nombre,
    foto: datos.foto  // Base64 string (o vacío si no hay)
  })
});
```

### 4. HTML del input file

```jsx
<input
  type="file"
  name="foto"
  accept="image/jpeg,image/png,image/webp,image/gif"
  onChange={handleChange}
  placeholder="Selecciona una foto (opcional)"
/>
```

### 5. Ejemplo completo de un componente Registro

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Registro() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    foto: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Convertir archivo a Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle de cambios en inputs
  const handleChange = async (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files[0]) {
      try {
        const base64 = await fileToBase64(files[0]);
        setFormData({
          ...formData,
          [name]: base64
        });
      } catch (error) {
        setError('Error al procesar la imagen');
        console.error(error);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Enviar registro
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(
        'https://tu-api.com/api/auth/registro',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error en el registro');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuari));
      navigate('/');
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Contraseña"
        required
      />
      <input
        type="text"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        placeholder="Nombre (opcional)"
      />
      <input
        type="file"
        name="foto"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleChange}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Registrarse</button>
    </form>
  );
}

export default Registro;
```

## Ventajas de esta aproximación:

✅ Las fotos se almacenan en MongoDB (permanente)  
✅ No requiere servidor de archivos  
✅ Funciona en cualquier plataforma (Vercel, Heroku, etc.)  
✅ La foto se devuelve automáticamente en login/perfil  

## Para mostrar la foto guardada:

```jsx
{usuari.foto && (
  <img 
    src={usuari.foto} 
    alt="Foto de perfil"
    style={{ maxWidth: '200px' }}
  />
)}
```

¡Listo! Aplica estos cambios y prueba el registro nuevamente.
