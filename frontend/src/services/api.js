// ===================================================================
// Cliente y Servicios API para Dulce Delicia Repostería
// Conexión con Backend FastAPI y Base de Datos Neon Tech / PostgreSQL
// ===================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

/**
 * Obtener token JWT almacenado en sesión activa
 */
export function getStoredToken() {
  const session = 
    localStorage.getItem('dulce_delicia_session') || 
    sessionStorage.getItem('dulce_delicia_session')
  if (!session) return null
  try {
    const parsed = JSON.parse(session)
    return parsed.access_token || parsed.token || null
  } catch (e) {
    return null
  }
}

/**
 * Función fetch encapsulada con inyección de Bearer Token y manejo de errores
 */
export async function apiFetch(endpoint, options = {}) {
  const token = getStoredToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  try {
    const response = await fetch(url, {
      ...options,
      headers
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      const errorMsg = data?.detail || data?.message || `Error del servidor (${response.status})`
      throw new Error(errorMsg)
    }

    return { ok: true, data, status: response.status }
  } catch (error) {
    return { ok: false, error: error.message || 'Error de conexión con la API' }
  }
}

// -------------------------------------------------------------
// 1. Servicio de Verificación de Estado (Health Check)
// -------------------------------------------------------------
export const healthService = {
  async check() {
    return await apiFetch('/health')
  }
}

// -------------------------------------------------------------
// 2. Servicio de Autenticación
// -------------------------------------------------------------
export const authService = {
  async login(email, password) {
    return await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  },

  async register(userData) {
    return await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        nombre: userData.nombre,
        apellido: userData.apellido,
        tipo_documento: userData.tipoDocumento || userData.tipo_documento || 'CC',
        numero_documento: userData.numeroDocumento || userData.numero_documento,
        telefono: userData.telefono || null,
        direccion: userData.direccion || null,
        email: userData.correo || userData.email,
        password: userData.password,
        rol_id: userData.rol_id || 3
      })
    })
  },

  async getProfile() {
    return await apiFetch('/auth/me')
  },

  getCurrentSession() {
    const raw = localStorage.getItem('dulce_delicia_session') || sessionStorage.getItem('dulce_delicia_session')
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },

  setSession(sessionData, remember = false) {
    const str = JSON.stringify(sessionData)
    if (remember) {
      localStorage.setItem('dulce_delicia_session', str)
      sessionStorage.removeItem('dulce_delicia_session')
    } else {
      sessionStorage.setItem('dulce_delicia_session', str)
      localStorage.removeItem('dulce_delicia_session')
    }
  },

  clearSession() {
    localStorage.removeItem('dulce_delicia_session')
    sessionStorage.removeItem('dulce_delicia_session')
  }
}

// -------------------------------------------------------------
// 3. Servicio de Gestión de Usuarios
// -------------------------------------------------------------
export const userService = {
  async getAll(params = {}) {
    const query = new URLSearchParams()
    if (params.search) query.append('search', params.search)
    if (params.rol_id) query.append('rol_id', params.rol_id)
    if (params.activo !== undefined) query.append('activo', params.activo)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return await apiFetch(`/users${qs}`)
  },

  async getRoles() {
    return await apiFetch('/users/roles')
  },

  async update(id, userData) {
    return await apiFetch(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    })
  },

  async delete(id) {
    return await apiFetch(`/users/${id}`, {
      method: 'DELETE'
    })
  }
}

// -------------------------------------------------------------
// 4. Servicio de Catálogo de Productos y Postres
// -------------------------------------------------------------
export const productService = {
  async getAll(params = {}) {
    const query = new URLSearchParams()
    if (params.search) query.append('search', params.search)
    if (params.categoria_id) query.append('categoria_id', params.categoria_id)
    if (params.solo_activos !== undefined) query.append('solo_activos', params.solo_activos)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return await apiFetch(`/products${qs}`)
  },

  async create(productData) {
    return await apiFetch('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    })
  },

  async update(id, productData) {
    return await apiFetch(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    })
  },

  async delete(id) {
    return await apiFetch(`/products/${id}`, {
      method: 'DELETE'
    })
  }
}

// -------------------------------------------------------------
// 5. Servicio de Categorías
// -------------------------------------------------------------
export const categoryService = {
  async getAll() {
    return await apiFetch('/categories')
  }
}

export default {
  API_BASE_URL,
  apiFetch,
  authService,
  userService,
  productService,
  categoryService,
  healthService
}
