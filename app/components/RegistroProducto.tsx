'use client'
import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase'; // <-- ruta corregida

type Props = {
  onBack: () => void;
  usuario: string; // obligatorio para registrar quién agrega el producto
};

export default function RegistroProducto({ onBack, usuario }: Props) {
  const [producto, setProducto] = useState('');
  const [marca, setMarca] = useState('');
  const [anio, setAnio] = useState('');
  const [codigo, setCodigo] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    if (!producto || !marca || !anio || !codigo || !cantidad) {
      alert('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'productos'), {
        producto,
        marca,
        anio,
        codigo,
        cantidad: Number(cantidad),
        creadoEn: Timestamp.now(),
        usuario
      });
      alert('Producto registrado con éxito!');
      setProducto('');
      setMarca('');
      setAnio('');
      setCodigo('');
      setCantidad('');
    } catch (error) {
      console.error(error);
      alert('Error al registrar producto');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#f7f7f7' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Registrar Producto</h1>

      <div style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="Producto" value={producto} onChange={(e) => setProducto(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <input type="text" placeholder="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <input type="text" placeholder="Año" value={anio} onChange={(e) => setAnio(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <input type="text" placeholder="Código de lector" value={codigo} onChange={(e) => setCodigo(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <input type="number" placeholder="Cantidad de botellas" value={cantidad} onChange={(e) => setCantidad(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} min="1" />

        <button onClick={handleGuardar} disabled={loading} style={{ padding: '12px', borderRadius: '5px', border: 'none', backgroundColor: '#4CAF50', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>

        <button onClick={onBack} style={{ padding: '12px', borderRadius: '5px', border: 'none', backgroundColor: '#f44336', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
          Regresar al Dashboard
        </button>
      </div>
    </div>
  );
}