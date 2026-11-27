import React, { useState, useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { userService, productService, orderService, healthService } from '../../services/api'

export default function AdminDashboard() {
  const { currentUser } = useOutletContext() || {}
  const isAdmin = currentUser?.rol === 'Administrador'

  const [metrics, setMetrics] = useState({
    userCount: 0,
    activeUsers: 0,
    productCount: 0,
    activeProducts: 0,
    orderCount: 0,
    pendingOrders: 0,
    totalSales: 0,
    dbEngine: ''
  })
  const [isApiOnline, setIsApiOnline] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let active = true

    async function loadMetrics() {
      setLoading(true)
      setErrorMsg('')

      const requests = [
        healthService.check(),
        productService.getAll({ solo_activos: false }),
        orderService.getAll(),
        isAdmin ? userService.getAll() : Promise.resolve({ ok: false, skipped: true })
      ]

      const [hRes, pRes, oRes, uRes] = await Promise.all(requests)
      if (!active) return

      setIsApiOnline(hRes.ok)
      if (!hRes.ok && pRes.isNetworkError) {
        setErrorMsg(pRes.error || 'No se pudo conectar con la API FastAPI.')
      }

      const products = pRes.ok && Array.isArray(pRes.data) ? pRes.data : []
      const orders = oRes.ok && Array.isArray(oRes.data) ? oRes.data : []
      const users = uRes.ok && Array.isArray(uRes.data) ? uRes.data : []

      const activeProducts = products.filter((p) => p.activo).length
      const pendingOrders = orders.filter((o) =>
        o.estado === 'Pendiente' || o.estado === 'En Preparacion'
      ).length
      const totalSales = orders
        .filter((o) => o.estado !== 'Cancelado')
        .reduce((acc, o) => acc + Number(o.total || 0), 0)

      setMetrics({
        userCount: users.length,
        activeUsers: users.filter((u) => u.activo).length,
        productCount: products.length,
        activeProducts,
        orderCount: orders.length,
        pendingOrders,
        totalSales,
        dbEngine: hRes.data?.motor_bd || ''
      })
      setLoading(false)
    }

    loadMetrics()
    return () => {
      active = false
    }
  }, [isAdmin])

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">

      {/* Bienvenida */}
      <div className="bg-gradient-to-r from-logo-cream via-white to-logo-pinkLight/30 p-6 sm:p-8 rounded-3xl border border-logo-pink/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs uppercase tracking-widest font-semibold text-logo-pinkHover">
              Resumen General
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
              isApiOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isApiOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
              {isApiOnline ? `FastAPI (${metrics.dbEngine || 'Activo'})` : 'API Desconectada'}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-logo-brown mt-1">
            Bienvenido al Panel de Gestión
          </h1>
          <p className="text-xs sm:text-sm text-logo-brownLight font-light mt-1 max-w-xl">
            Monitorea usuarios, administra el catálogo de postres y revisa métricas reales directamente desde la base de datos.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/productos"
            className="px-4 py-2.5 rounded-full bg-logo-pink hover:bg-logo-pinkHover text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
          >
            + Nuevo Postre
          </Link>
          {isAdmin && (
            <Link
              to="/admin/usuarios"
              className="px-4 py-2.5 rounded-full border border-logo-pink text-logo-brown hover:bg-logo-pinkLight/50 text-xs sm:text-sm font-semibold transition-all"
            >
              + Gestionar Usuarios
            </Link>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
          {errorMsg}
        </div>
      )}

      {/* 4 Tarjetas de Métricas (KPIs reales desde FastAPI) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* KPI 1: Usuarios */}
        <div className="bg-white p-6 rounded-3xl border border-logo-pink/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl shrink-0">
            👥
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Usuarios Registrados</span>
            <h3 className="font-display text-2xl font-bold text-logo-brown">
              {loading ? '...' : isAdmin ? metrics.userCount : 'N/A'}
            </h3>
            <span className="text-[11px] text-purple-600 font-medium">
              {isAdmin ? `${metrics.activeUsers} activos en BD` : 'Solo Administrador'}
            </span>
          </div>
        </div>

        {/* KPI 2: Catálogo de Postres */}
        <div className="bg-white p-6 rounded-3xl border border-logo-pink/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-logo-pinkHover flex items-center justify-center text-2xl shrink-0">
            🧁
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Postres en Carta</span>
            <h3 className="font-display text-2xl font-bold text-logo-brown">
              {loading ? '...' : metrics.productCount}
            </h3>
            <span className="text-[11px] text-emerald-600 font-medium">
              {metrics.activeProducts} disponibles
            </span>
          </div>
        </div>

        {/* KPI 3: Pedidos Realizados */}
        <div className="bg-white p-6 rounded-3xl border border-logo-pink/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl shrink-0">
            📦
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Pedidos Registrados</span>
            <h3 className="font-display text-2xl font-bold text-logo-brown">
              {loading ? '...' : metrics.orderCount}
            </h3>
            <span className="text-[11px] text-amber-600 font-medium">
              {metrics.pendingOrders} pendientes / en cocina
            </span>
          </div>
        </div>

        {/* KPI 4: Ventas Totales */}
        <div className="bg-white p-6 rounded-3xl border border-logo-pink/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl shrink-0">
            💰
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Ventas Totales</span>
            <h3 className="font-display text-2xl font-bold text-logo-brown">
              {loading ? '...' : `$ ${metrics.totalSales.toLocaleString('es-CO')}`}
            </h3>
            <span className="text-[11px] text-emerald-600 font-medium">
              Datos reales de pedidos
            </span>
          </div>
        </div>

      </div>

      {/* Módulos de Acceso Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {isAdmin && (
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
              Administra los roles del sistema (Administrador, Empleado, Cliente), crea cuentas y cambia el estado de acceso.
            </p>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs bg-purple-50 text-purple-700 font-medium">CRUD Completo</span>
              <span className="px-2.5 py-1 rounded-lg text-xs bg-emerald-50 text-emerald-700 font-medium">Persistido en BD</span>
            </div>
          </div>
        )}

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
            Crea nuevos postres para la carta, edita precios, stock y categorías, o desactiva productos temporalmente.
          </p>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs bg-pink-50 text-logo-pinkHover font-medium">Operaciones CRUD</span>
            <span className="px-2.5 py-1 rounded-lg text-xs bg-amber-50 text-amber-700 font-medium">Control de Stock</span>
          </div>
        </div>

      </div>

    </div>
  )
}
