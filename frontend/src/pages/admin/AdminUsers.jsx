import React, { useState, useEffect } from 'react'
import ConfirmModal from '../../components/admin/ConfirmModal'
import ToastAlert from '../../components/admin/ToastAlert'
import { userService } from '../../services/api'

const INITIAL_USERS = [
  {
    id: 1,
    nombre: 'Valentina',
    apellido: 'Gómez Restrepo',
    correo: 'admin@dulcedelicia.com',
    telefono: '+57 312 890 4521',
    tipoDocumento: 'CC',
    numeroDocumento: '1020304050',
    rol: 'Administrador',
    estado: 'Activo',
    fechaRegistro: '2026-11-20'
  },
  {
    id: 2,
    nombre: 'Santiago',
    apellido: 'Montoya Pérez',
    correo: 'repostero@dulcedelicia.com',
    telefono: '+57 300 456 7890',
    tipoDocumento: 'CC',
    numeroDocumento: '1098765432',
    rol: 'Empleado',
    estado: 'Activo',
    fechaRegistro: '2026-11-21'
  },
  {
    id: 3,
    nombre: 'Carolina',
    apellido: 'Duque Morales',
    correo: 'carolina.cliente@gmail.com',
    telefono: '+57 315 111 2233',
    tipoDocumento: 'CC',
    numeroDocumento: '1035987612',
    rol: 'Cliente',
    estado: 'Activo',
    fechaRegistro: '2026-11-22'
  },
  {
    id: 4,
    nombre: 'Mateo',
    apellido: 'Jaramillo Castro',
    correo: 'mateo.cliente@outlook.com',
    telefono: '+57 320 999 8877',
    tipoDocumento: 'CC',
    numeroDocumento: '1044556677',
    rol: 'Cliente',
    estado: 'Inactivo',
    fechaRegistro: '2026-11-23'
  }
]

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [isConnectedToApi, setIsConnectedToApi] = useState(false)

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
    tipoDocumento: 'CC',
    numeroDocumento: '',
    rol: 'Cliente',
    estado: 'Activo'
  })

  // Cargar usuarios desde FastAPI / Neon o localStorage
  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await userService.getAll()
        if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
          const apiUsers = res.data.map((u) => ({
            id: u.id,
            nombre: u.nombre,
            apellido: u.apellido,
            correo: u.email,
            telefono: u.telefono || '',
            tipoDocumento: u.tipo_documento || 'CC',
            numeroDocumento: u.numero_documento,
            rol: u.rol?.nombre || (u.rol_id === 1 ? 'Administrador' : u.rol_id === 2 ? 'Empleado' : 'Cliente'),
            estado: u.activo ? 'Activo' : 'Inactivo',
            fechaRegistro: u.fecha_registro ? u.fecha_registro.split('T')[0] : '2026-11-26'
          }))
          setUsers(apiUsers)
          setIsConnectedToApi(true)
          return
        }
      } catch (err) {
        // Fallback local
      }

      const stored = localStorage.getItem('dulce_delicia_users_crud')
      if (stored) {
        try {
          setUsers(JSON.parse(stored))
        } catch (e) {
          setUsers(INITIAL_USERS)
        }
      } else {
        setUsers(INITIAL_USERS)
        localStorage.setItem('dulce_delicia_users_crud', JSON.stringify(INITIAL_USERS))
      }
    }
    loadUsers()
  }, [])

  // Guardar en localStorage cada vez que cambien los usuarios
  const saveUsers = (newUsersList) => {
    setUsers(newUsersList)
    localStorage.setItem('dulce_delicia_users_crud', JSON.stringify(newUsersList))
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
      tipoDocumento: 'CC',
      numeroDocumento: '',
      rol: 'Cliente',
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
      tipoDocumento: user.tipoDocumento,
      numeroDocumento: user.numeroDocumento,
      rol: user.rol,
      estado: user.estado
    })
    setIsModalOpen(true)
  }

  // Guardar (Crear o Actualizar)
  const handleSaveUser = (e) => {
    e.preventDefault()

    // Validaciones estrictas: no números en nombre/apellido, no solo espacios
    const nombreTrim = formData.nombre.trim()
    const apellidoTrim = formData.apellido.trim()
    const correoTrim = formData.correo.trim()

    if (!nombreTrim || !apellidoTrim || !correoTrim || !formData.numeroDocumento.trim()) {
      setToast({ message: 'Todos los campos marcados son obligatorios y no pueden ser solo espacios.', type: 'error' })
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

    if (isEditing && selectedUser) {
      // Actualizar usuario existente
      const updated = users.map((u) =>
        u.id === selectedUser.id
          ? { ...u, ...formData, nombre: nombreTrim, apellido: apellidoTrim, correo: correoTrim }
          : u
      )
      saveUsers(updated)
      setToast({ message: `Usuario ${nombreTrim} actualizado con éxito.`, type: 'success' })
    } else {
      // Crear nuevo usuario
      const newUser = {
        ...formData,
        id: Date.now(),
        nombre: nombreTrim,
        apellido: apellidoTrim,
        correo: correoTrim,
        fechaRegistro: new Date().toISOString().split('T')[0]
      }
      saveUsers([newUser, ...users])
      setToast({ message: `Nuevo usuario ${nombreTrim} creado exitosamente.`, type: 'success' })
    }

    setIsModalOpen(false)
  }

  // Cambiar estado Activo / Inactivo con un clic
  const handleToggleStatus = async (userId) => {
    const targetUser = users.find((u) => u.id === userId)
    const nuevoEstado = targetUser?.estado === 'Activo' ? 'Inactivo' : 'Activo'

    if (isConnectedToApi && targetUser) {
      await userService.update(userId, { activo: nuevoEstado === 'Activo' })
    }

    const updated = users.map((u) => {
      if (u.id === userId) {
        setToast({ message: `Estado de ${u.nombre} cambiado a ${nuevoEstado}.`, type: 'success' })
        return { ...u, estado: nuevoEstado }
      }
      return u
    })
    saveUsers(updated)
  }

  // Solicitar confirmación de eliminación
  const handleRequestDelete = (user) => {
    setUserToDelete(user)
    setIsConfirmDeleteOpen(true)
  }

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!userToDelete) return
    if (isConnectedToApi) {
      await userService.delete(userToDelete.id)
    }
    const updated = users.filter((u) => u.id !== userToDelete.id)
    saveUsers(updated)
    setIsConfirmDeleteOpen(false)
    setToast({ message: `El usuario ${userToDelete.nombre} ${userToDelete.apellido} ha sido eliminado.`, type: 'success' })
    setUserToDelete(null)
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Toast Alert */}
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
            Crea, actualiza, asigna roles y gestiona permisos del personal y clientes de Dulce Delicia.
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

      {/* Barra de Filtros y Búsqueda en Tiempo Real */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-logo-pink/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Buscador */}
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

        {/* Filtros de Rol y Estado */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-logo-pink/30 text-xs text-logo-brown bg-white outline-none focus:border-logo-pink"
          >
            <option value="Todos">Todos los Roles</option>
            <option value="Administrador">Administrador</option>
            <option value="Empleado">Empleado</option>
            <option value="Cliente">Cliente</option>
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

      {/* Tabla CRUD de Usuarios (Read) */}
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-logo-vanilla/40 transition-colors">
                    
                    {/* Usuario */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-logo-pink/20 text-logo-brown font-bold flex items-center justify-center text-xs shrink-0">
                          {u.nombre[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-logo-brown">{u.nombre} {u.apellido}</div>
                          <div className="text-[11px] text-gray-500">{u.correo}</div>
                        </div>
                      </div>
                    </td>

                    {/* Documento */}
                    <td className="py-3.5 px-4 text-gray-600 font-mono text-xs">
                      {u.tipoDocumento}: {u.numeroDocumento}
                    </td>

                    {/* Teléfono */}
                    <td className="py-3.5 px-4 text-gray-600">
                      {u.telefono || 'Sin teléfono'}
                    </td>

                    {/* Rol */}
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

                    {/* Estado con botón toggle interactivo */}
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

                    {/* Acciones CRUD (Editar / Eliminar) */}
                    <td className="py-3.5 px-4 sm:px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Botón Editar */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Editar usuario"
                        >
                          ✏️
                        </button>

                        {/* Botón Eliminar */}
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

      {/* Modal para Crear / Editar Usuario (Create / Update) */}
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
                  <label className="block text-xs font-semibold text-logo-brown mb-1">Rol en el Sistema *</label>
                  <select
                    value={formData.rol}
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-logo-pink/30 text-xs bg-white outline-none focus:border-logo-pink font-semibold"
                  >
                    <option value="Cliente">Cliente</option>
                    <option value="Empleado">Empleado</option>
                    <option value="Administrador">Administrador</option>
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
                  className="px-6 py-2 rounded-full bg-logo-pink hover:bg-logo-pinkHover text-white text-xs font-semibold shadow-md transition-all"
                >
                  {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación (Delete) con Bloqueo de 3s y Desglose */}
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
