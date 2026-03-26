'use client'
import React, { useEffect, useState } from 'react';
import RegistroProducto from './components/RegistroProducto';
import MovimientoStock from './components/MovimientoStock';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './lib/firebase';

export default function Page() {
  const [vista, setVista] = useState<'dashboard' | 'registroProducto' | 'movimientoStock'>('dashboard');
  const [totalProductos, setTotalProductos] = useState(0);
  const [totalMovimientos, setTotalMovimientos] = useState(0);

  const usuarioActual = "Raul";

  // Cargar resumen para las tarjetas
  useEffect(() => {
    if (vista !== 'dashboard') return;

    const fetchResumen = async () => {
      const prodSnap = await getDocs(collection(db, 'productos'));
      setTotalProductos(prodSnap.size);

      const movSnap = await getDocs(collection(db, 'movimientos'));
      setTotalMovimientos(movSnap.size);
    };

    fetchResumen();
  }, [vista]);

  if (vista === 'registroProducto') return <RegistroProducto onBack={() => setVista('dashboard')} usuario={usuarioActual} />;
  if (vista === 'movimientoStock') return <MovimientoStock onBack={() => setVista('dashboard')} usuario={usuarioActual} />;

  // Dashboard principal
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Dashboard Inventario</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '30px',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Tarjeta Registrar Producto */}
        <div
          onClick={() => setVista('registroProducto')}
          style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.25)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.15)'; }}
        >
          <div style={{ fontSize: '50px', marginBottom: '15px' }}>🍾</div>
          <div style={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>Registrar Producto</div>
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>Total Productos: {totalProductos}</div>
        </div>

        {/* Tarjeta Registrar Entrada / Salida */}
        <div
          onClick={() => setVista('movimientoStock')}
          style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.25)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.15)'; }}
        >
          <div style={{ fontSize: '50px', marginBottom: '15px' }}>📦</div>
          <div style={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>Registrar Entrada / Salida</div>
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>Total Movimientos: {totalMovimientos}</div>
        </div>
      </div>
    </div>
  );
}