import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { userService, productService, healthService } from '../../services/api'

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState(4)
  const [productCount, setProductCount] = useState(10)
  const [isApiOnline, setIsApiOnline] = useState(false)

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [uRes, pRes, hRes] = await Promise.all([
          userService.getAll(),
          productService.getAll({ solo_activos: false }),
          healthService.check()
        ])

        if (hRes.ok) setIsApiOnline(true)

        if (uRes.ok && Array.isArray(uRes.data)) {
          setUserCount(uRes.data.length)
        } else {
          const users = JSON.parse(localStorage.getItem('dulce_delicia_users_crud') || '[]')
          setUserCount(users.length || 4)
        }

        if (pRes.ok && Array.isArray(pRes.data)) {
          setProductCount(pRes.data.length)
        } else {
          const products = JSON.parse(localStorage.getItem('dulce_delicia_products_crud') || '[]')
          setProductCount(products.length || 10)
        }
      } catch {
        const users = JSON.parse(localStorage.getItem('dulce_delicia_users_crud') || '[]')
        setUserCount(users.length || 4)
        const products = JSON.parse(localStorage.getItem('dulce_delicia_products_crud') || '[]')
        setProductCount(products.length || 10)
      }
    }
    loadMetrics()
  }, [])

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Bienvenida */}
      <div className="bg-gradient-to-r from-logo-cream via-white to-logo-pinkLight/30 p-6 sm:p-8 rounded-3xl border border-logo-pink/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-logo-pinkHover">
            Resumen General
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-logo-brown mt-1">
            Bienvenido al Panel de Gestión
          </h1>
          <p className="text-xs sm:text-sm text-logo-brownLight font-light mt-1 max-w-xl">
            Monitorea los usuarios, controla los roles y permisos, y administra el catálogo de postres de Dulce Delicia en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/productos"
            className="px-4 py-2.5 rounded-full bg-logo-pink hover:bg-logo-pinkHover text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
          >
            + Nuevo Postre
          </Link>
          <Link
            to="/admin/usuarios"
            className="px-4 py-2.5 rounded-full border border-logo-pink text-logo-brown hover:bg-logo-pinkLight/50 text-xs sm:text-sm font-semibold transition-all"
          >
            + Gestionar Usuarios
          </Link>
        </div>
      </div>

      {/* 4 Tarjetas de Métricas (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Usuarios */}
        <div className="bg-white p-6 rounded-3xl border border-logo-pink/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl shrink-0">
            👥
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Usuarios Registrados</span>
            <h3 className="font-display text-2xl font-bold text-logo-brown">{userCount}</h3>
            <span className="text-[11px] text-purple-600 font-medium">Roles: Admin, Empleado, Cliente</span>
          </div>
        </div>

        {/* KPI 2: Catálogo de Postres */}
        <div className="bg-white p-6 rounded-3xl border border-logo-pink/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-logo-pinkHover flex items-center justify-center text-2xl shrink-0">
            🧁
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Postres en Carta</span>
            <h3 className="font-display text-2xl font-bold text-logo-brown">{productCount}</h3>
            <span className="text-[11px] text-emerald-600 font-medium">100% Activos</span>
          </div>
        </div>

        {/* KPI 3: Pedidos del Mes */}
        <div className="bg-white p-6 rounded-3xl border border-logo-pink/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl shrink-0">
            📦
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Pedidos Realizados</span>
            <h3 className="font-display text-2xl font-bold text-logo-brown">48</h3>
            <span className="text-[11px] text-amber-600 font-medium">12 en preparación</span>
          </div>
        </div>

        {/* KPI 4: Ventas Estimadas */}
        <div className="bg-white p-6 rounded-3xl border border-logo-pink/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl shrink-0">
            💰
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Ventas Estimadas</span>
            <h3 className="font-display text-2xl font-bold text-logo-brown">$ 2.850.000</h3>
            <span className="text-[11px] text-emerald-600 font-medium">+15% vs mes anterior</span>
          </div>
        </div>

      </div>

      {/* Módulos de Acceso Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Acceso a Usuarios y Permisos */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-logo-pink/20 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-logo-brown flex items-center gap-2">
              <span>👥</span> Control de Usuarios y Permisos
            </h3>
            <Link to="/admin/usuarios" className="text-xs text-logo-pinkHover hover:underline font-semibold">
              Ver todos →
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 font-light mb-4">
            Administra los roles del sistema (Administrador, Empleado, Cliente), modifica permisos y cambia el estado de las cuentas (Activo / Inactivo).
          </p>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs bg-purple-50 text-purple-700 font-medium">CRUD Completo</span>
            <span className="px-2.5 py-1 rounded-lg text-xs bg-emerald-50 text-emerald-700 font-medium">Confirmación de borrado</span>
          </div>
        </div>

        {/* Acceso a Catálogo de Postres */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-logo-pink/20 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-logo-brown flex items-center gap-2">
              <span>🧁</span> Catálogo de Postres y Especialidades
            </h3>
            <Link to="/admin/productos" className="text-xs text-logo-pinkHover hover:underline font-semibold">
              Ver todos →
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 font-light mb-4">
            Crea nuevos postres para la carta, edita precios, nombres y categorías, o desactiva productos temporalmente cuando estén agotados.
          </p>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs bg-pink-50 text-logo-pinkHover font-medium">Operaciones CRUD</span>
            <span className="px-2.5 py-1 rounded-lg text-xs bg-amber-50 text-amber-700 font-medium">Control de Disponibilidad</span>
          </div>
        </div>

      </div>

    </div>
  )
}
