'use client'
import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

type Props = {
  onBack: () => void;
  usuario: string; // usuario que registra el movimiento
};

export default function MovimientoStock({ onBack, usuario }: Props) {
  const [productos, setProductos] = useState<{ id: string; producto: string; cantidad: number }[]>([]);
  const [productoId, setProductoId] = useState('');
  const [tipo, setTipo] = useState<'entrada' | 'salida'>('entrada');
  const [cantidad, setCantidad] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar productos desde Firebase
  useEffect(() => {
    const fetchProductos = async () => {
      const snapshot = await getDocs(collection(db, 'productos'));
      const lista: { id: string; producto: string; cantidad: number }[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        lista.push({ id: doc.id, producto: data.producto, cantidad: data.cantidad || 0 });
      });
      setProductos(lista);
    };
    fetchProductos();
  }, []);

  const handleRegistrar = async () => {
    if (!productoId || !cantidad || Number(cantidad) <= 0) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    setLoading(true);
    try {
      // Registrar movimiento
      await addDoc(collection(db, 'movimientos'), {
        productoId,
        cantidad: Number(cantidad),
        tipo,
        fecha: Timestamp.now(),
        usuario
      });

      // Actualizar cantidad en productos
      const prodRef = doc(db, 'productos', productoId);
      const prod = productos.find(p => p.id === productoId);
      let cantidadActual = prod?.cantidad || 0;
      cantidadActual = tipo === 'entrada' ? cantidadActual + Number(cantidad) : cantidadActual - Number(cantidad);
      if (cantidadActual < 0) cantidadActual = 0;
      await updateDoc(prodRef, { cantidad: cantidadActual });

      alert('Movimiento registrado con éxito!');
      setCantidad('');
    } catch (error) {
      console.error(error);
      alert('Error al registrar movimiento');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#f7f7f7' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Registrar Entrada / Salida</h1>

      <div style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <select value={productoId} onChange={(e) => setProductoId(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
          <option value="">Selecciona un producto</option>
          {productos.map(p => (
            <option key={p.id} value={p.id}>
              {p.producto} (Stock: {p.cantidad})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          min="1"
        />

        <select value={tipo} onChange={(e) => setTipo(e.target.value as 'entrada' | 'salida')} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
          <option value="entrada">Entrada</option>
          <option value="salida">Salida</option>
        </select>

        <button
          onClick={handleRegistrar}
          disabled={loading}
          style={{ padding: '12px', borderRadius: '5px', border: 'none', backgroundColor: '#4CAF50', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {loading ? 'Guardando...' : 'Registrar Movimiento'}
        </button>

        <button
          onClick={onBack}
          style={{ padding: '12px', borderRadius: '5px', border: 'none', backgroundColor: '#f44336', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Regresar al Dashboard
        </button>
      </div>
    </div>
  );
}