import React, { useState, useEffect, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import ConfirmModal from '../../components/admin/ConfirmModal'
import ToastAlert from '../../components/admin/ToastAlert'
import { userService } from '../../services/api'

function mapApiUser(u) {
  return {
    id: u.id,
    nombre: u.nombre,
    apellido: u.apellido,
    correo: u.email,
    telefono: u.telefono || '',
    direccion: u.direccion || '',
    tipoDocumento: u.tipo_documento || 'CC',
    numeroDocumento: u.numero_documento,
    rol_id: u.rol_id,
    rol: u.rol?.nombre || (u.rol_id === 1 ? 'Administrador' : u.rol_id === 2 ? 'Empleado' : 'Cliente'),
    activo: u.activo,
    estado: u.activo ? 'Activo' : 'Inactivo',
    fechaRegistro: u.fecha_registro ? u.fecha_registro.split('T')[0] : ''
  }
}

export default function AdminUsers() {
  const { currentUser } = useOutletContext() || {}
  const isAdmin = currentUser?.rol === 'Administrador'

  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Modal de Confirmación de Eliminación
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  // Alerta Toast
  const [toast, setToast] = useState({ message: '', type: 'success' })

  // Formulario de Usuario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    direccion: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    password: '',
    rol_id: 3,
    estado: 'Activo'
  })

  const loadData = useCallback(async () => {
    if (!isAdmin) {
      setLoading(false)
      return
    }
    setLoading(true)
    setApiError('')

    const [uRes, rRes] = await Promise.all([
      userService.getAll(),
      userService.getRoles()
    ])

    if (rRes.ok && Array.isArray(rRes.data)) {
      setRoles(rRes.data)
    }

    if (uRes.ok && Array.isArray(uRes.data)) {
      setUsers(uRes.data.map(mapApiUser))
    } else {
      setApiError(uRes.error || 'No fue posible cargar la lista de usuarios desde la API.')
    }
    setLoading(false)
  }, [isAdmin])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-3xl border border-rose-200 text-center space-y-2">
        <span className="text-3xl block">🔒</span>
        <h2 className="font-display text-xl font-bold text-logo-brown">Acceso Restringido</h2>
        <p className="text-xs sm:text-sm text-logo-brownLight">
          Solo los usuarios con rol de Administrador pueden gestionar las cuentas y roles del sistema.
        </p>
      </div>
    )
  }

  // Filtrado en tiempo real
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      `${u.nombre} ${u.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.numeroDocumento.includes(searchTerm)
    const matchesRole = roleFilter === 'Todos' || u.rol === roleFilter
    const matchesStatus = statusFilter === 'Todos' || u.estado === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  // Abrir Modal para Crear
  const handleOpenCreate = () => {
    setIsEditing(false)
    setSelectedUser(null)
    setFormData({
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      direccion: '',
      tipoDocumento: 'CC',
      numeroDocumento: '',
      password: '',
      rol_id: 3,
      estado: 'Activo'
    })
    setIsModalOpen(true)
  }

  // Abrir Modal para Editar
  const handleOpenEdit = (user) => {
    setIsEditing(true)
    setSelectedUser(user)
    setFormData({
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      telefono: user.telefono,
      direccion: user.direccion || '',
      tipoDocumento: user.tipoDocumento,
      numeroDocumento: user.numeroDocumento,
      password: '',
      rol_id: user.rol_id,
      estado: user.estado
    })
    setIsModalOpen(true)
  }

  // Guardar (Crear o Actualizar vía FastAPI)
  const handleSaveUser = async (e) => {
    e.preventDefault()

    const nombreTrim = formData.nombre.trim()
    const apellidoTrim = formData.apellido.trim()
    const correoTrim = formData.correo.trim().toLowerCase()
    const docTrim = formData.numeroDocumento.trim()

    if (!nombreTrim || !apellidoTrim || !correoTrim || !docTrim) {
      setToast({ message: 'Todos los campos marcados son obligatorios.', type: 'error' })
      return
    }

    if (/[0-9]/.test(nombreTrim) || /[0-9]/.test(apellidoTrim)) {
      setToast({ message: 'El nombre y apellido no pueden contener números.', type: 'error' })
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoTrim)) {
      setToast({ message: 'El formato de correo no es válido.', type: 'error' })
      return
    }

    if (!isEditing && formData.password.length < 8) {
      setToast({ message: 'La contraseña debe tener al menos 8 caracteres.', type: 'error' })
      return
    }

    if (isEditing && formData.password && formData.password.length < 8) {
      setToast({ message: 'Si cambias la contraseña, debe tener al menos 8 caracteres.', type: 'error' })
      return
    }

    setSaving(true)

    if (isEditing && selectedUser) {
      const payload = {
        nombre: nombreTrim,
        apellido: apellidoTrim,
        email: correoTrim,
        telefono: formData.telefono.trim() || null,
        direccion: formData.direccion.trim() || null,
        tipo_documento: formData.tipoDocumento,
        numero_documento: docTrim,
        rol_id: Number(formData.rol_id),
        activo: formData.estado === 'Activo'
      }
      if (formData.password) {
        payload.password = formData.password
      }

      const res = await userService.update(selectedUser.id, payload)
      setSaving(false)

      if (!res.ok) {
        setToast({ message: res.error || 'No fue posible actualizar el usuario.', type: 'error' })
        return
      }

      const mapped = mapApiUser(res.data)
      setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? mapped : u)))
      setToast({ message: `Usuario ${mapped.nombre} actualizado en base de datos.`, type: 'success' })
    } else {
      const payload = {
        nombre: nombreTrim,
        apellido: apellidoTrim,
        email: correoTrim,
        telefono: formData.telefono.trim() || null,
        direccion: formData.direccion.trim() || null,
        tipo_documento: formData.tipoDocumento,
        numero_documento: docTrim,
        password: formData.password,
        rol_id: Number(formData.rol_id),
        activo: formData.estado === 'Activo'
      }

      const res = await userService.create(payload)
      setSaving(false)

      if (!res.ok) {
        setToast({ message: res.error || 'No fue posible crear el usuario.', type: 'error' })
        return
      }

      const mapped = mapApiUser(res.data)
      setUsers((prev) => [...prev, mapped])
      setToast({ message: `Usuario ${mapped.nombre} creado y guardado en base de datos.`, type: 'success' })
    }

    setIsModalOpen(false)
  }

  // Cambiar estado Activo / Inactivo en FastAPI
  const handleToggleStatus = async (userId) => {
    const targetUser = users.find((u) => u.id === userId)
    if (!targetUser) return

    const nuevoActivo = !targetUser.activo
    const res = await userService.update(userId, { activo: nuevoActivo })

    if (!res.ok) {
      setToast({ message: res.error || 'Error al actualizar el estado del usuario.', type: 'error' })
      return
    }

    const mapped = mapApiUser(res.data)
    setUsers((prev) => prev.map((u) => (u.id === userId ? mapped : u)))
    setToast({ message: `Estado de ${mapped.nombre} cambiado a ${mapped.estado}.`, type: 'success' })
  }

  const handleRequestDelete = (user) => {
    setUserToDelete(user)
    setIsConfirmDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) return
    const res = await userService.delete(userToDelete.id)
    setIsConfirmDeleteOpen(false)

    if (!res.ok) {
      setToast({ message: res.error || 'No fue posible eliminar el usuario.', type: 'error' })
      setUserToDelete(null)
      return
    }

    if (res.data?.desactivado) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userToDelete.id ? { ...u, activo: false, estado: 'Inactivo' } : u))
      )
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id))
    }

    setToast({ message: res.data?.message || 'Operación completada.', type: 'success' })
    setUserToDelete(null)
  }

  const availableRoles = roles.length > 0
    ? roles
    : [
        { id: 1, nombre: 'Administrador' },
        { id: 2, nombre: 'Empleado' },
        { id: 3, nombre: 'Cliente' }
      ]

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">

      <ToastAlert
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Cabecera y Botón Nuevo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-logo-brown">
            Gestión de Usuarios y Roles
          </h2>
          <p className="text-xs sm:text-sm text-logo-brownLight font-light">
            Crea, actualiza, asigna roles y gestiona permisos del personal y clientes en la base de datos.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-logo-pink hover:bg-logo-pinkHover text-white text-xs sm:text-sm font-semibold shadow-md transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer self-start sm:self-auto"
        >
          <span>➕</span>
          <span>Registrar Nuevo Usuario</span>
        </button>
      </div>

      {apiError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between gap-3">
          <span>{apiError}</span>
          <button
            type="button"
            onClick={loadData}
            className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-semibold"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-logo-pink/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            🔍
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, correo o documento..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-logo-pink/30 text-xs sm:text-sm outline-none focus:border-logo-pink bg-logo-vanilla/30"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-logo-pink/30 text-xs text-logo-brown bg-white outline-none focus:border-logo-pink"
          >
            <option value="Todos">Todos los Roles</option>
            {availableRoles.map((r) => (
              <option key={r.id} value={r.nombre}>{r.nombre}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-logo-pink/30 text-xs text-logo-brown bg-white outline-none focus:border-logo-pink"
          >
            <option value="Todos">Todos los Estados</option>
            <option value="Activo">Activos</option>
            <option value="Inactivo">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Tabla CRUD de Usuarios */}
      <div className="bg-white rounded-3xl border border-logo-pink/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-logo-cream via-white to-logo-pinkLight/30 border-b border-logo-pink/20 text-logo-brown font-semibold">
                <th className="py-3.5 px-4 sm:px-6">Usuario</th>
                <th className="py-3.5 px-4">Documento</th>
                <th className="py-3.5 px-4">Teléfono</th>
                <th className="py-3.5 px-4">Rol Asignado</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-logo-pink/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Cargando usuarios desde FastAPI...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-logo-vanilla/40 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-logo-pink/20 text-logo-brown font-bold flex items-center justify-center text-xs shrink-0">
                          {u.nombre?.[0] || 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-logo-brown">{u.nombre} {u.apellido}</div>
                          <div className="text-[11px] text-gray-500">{u.correo}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 font-mono text-xs">
                      {u.tipoDocumento}: {u.numeroDocumento}
                    </td>

                    <td className="py-3.5 px-4 text-gray-600">
                      {u.telefono || 'Sin teléfono'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        u.rol === 'Administrador'
                          ? 'bg-purple-100 text-purple-700'
                          : u.rol === 'Empleado'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {u.rol}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                          u.estado === 'Activo'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                        title="Haz clic para alternar estado"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${u.estado === 'Activo' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <span>{u.estado}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Editar usuario"
                        >
                          ✏️
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRequestDelete(u)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar usuario"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No se encontraron usuarios que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear / Editar Usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-logo-brown/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-logo-pink/30 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-logo-cream to-white p-5 border-b border-logo-pink/20 flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-logo-brown">
                {isEditing ? 'Editar Usuario / Rol' : 'Registrar Nuevo Usuario'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-logo-pink/20 text-gray-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-5 sm:p-6 space-y-3.5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-logo-brown mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    placeholder="Solo letras"
                    className="w-full px-3 py-2 rounded-xl border border-logo-pink/30 text-xs sm:text-sm outline-none focus:border-logo-pink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-logo-brown mb-1">Apellido *</label>
                  <input
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    required
                    placeholder="Solo letras"
                    className="w-full px-3 py-2 rounded-xl border border-logo-pink/30 text-xs sm:text-sm outline-none focus:border-logo-pink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-logo-brown mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  required
                  placeholder="usuario@ejemplo.com"
                  className="w-full px-3 py-2 rounded-xl border border-logo-pink/30 text-xs sm:text-sm outline-none focus:border-logo-pink"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-logo-brown mb-1">Tipo Documento</label>
                  <select
                    value={formData.tipoDocumento}
                    onChange={(e) => setFormData({ ...formData, tipoDocumento: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-logo-pink/30 text-xs bg-white outline-none focus:border-logo-pink"
                  >
                    <option value="CC">C.C.</option>
                    <option value="CE">C.E.</option>
                    <option value="TI">T.I.</option>
                    <option value="PAS">Pasaporte</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-logo-brown mb-1">No. Documento *</label>
                  <input
                    type="text"
                    value={formData.numeroDocumento}
                    onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })}
                    required
                    placeholder="10203040"
                    className="w-full px-3 py-2 rounded-xl border border-logo-pink/30 text-xs sm:text-sm outline-none focus:border-logo-pink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-logo-brown mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="300 123 4567"
                    className="w-full px-3 py-2 rounded-xl border border-logo-pink/30 text-xs sm:text-sm outline-none focus:border-logo-pink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-logo-brown mb-1">Dirección</label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    placeholder="Calle 10 # 20-30"
                    className="w-full px-3 py-2 rounded-xl border border-logo-pink/30 text-xs sm:text-sm outline-none focus:border-logo-pink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-logo-brown mb-1">
                  {isEditing ? 'Nueva Contraseña (opcional, mín. 8 caracteres)' : 'Contraseña * (mín. 8 caracteres)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!isEditing}
                  placeholder={isEditing ? 'Dejar vacío para conservar actual' : 'Mínimo 8 caracteres'}
                  className="w-full px-3 py-2 rounded-xl border border-logo-pink/30 text-xs sm:text-sm outline-none focus:border-logo-pink"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-logo-brown mb-1">Rol en el Sistema *</label>
                  <select
                    value={formData.rol_id}
                    onChange={(e) => setFormData({ ...formData, rol_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-logo-pink/30 text-xs bg-white outline-none focus:border-logo-pink font-semibold"
                  >
                    {availableRoles.map((r) => (
                      <option key={r.id} value={r.id}>{r.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-logo-brown mb-1">Estado de Cuenta</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-logo-pink/30 text-xs bg-white outline-none focus:border-logo-pink font-semibold"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-logo-pink/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-full bg-logo-pink hover:bg-logo-pinkHover text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        title="¿Eliminar definitivamente este usuario?"
        itemDetails={
          userToDelete && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div><strong className="text-logo-brown">Nombre Completo:</strong> {userToDelete.nombre} {userToDelete.apellido}</div>
              <div><strong className="text-logo-brown">Correo Electrónico:</strong> {userToDelete.correo}</div>
              <div><strong className="text-logo-brown">Documento:</strong> {userToDelete.tipoDocumento} - {userToDelete.numeroDocumento}</div>
              <div><strong className="text-logo-brown">Teléfono:</strong> {userToDelete.telefono || 'Sin registrar'}</div>
              <div><strong className="text-logo-brown">Rol del Sistema:</strong> {userToDelete.rol}</div>
              <div><strong className="text-logo-brown">Estado Actual:</strong> {userToDelete.estado}</div>
            </div>
          )
        }
        confirmText="Sí, Eliminar Definitivamente"
        cancelText="Cancelar y Mantener"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmDeleteOpen(false)
          setUserToDelete(null)
        }}
      />

    </div>
  )
}
