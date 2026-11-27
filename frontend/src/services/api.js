// ===================================================================
// Cliente y Servicios API para Dulce Delicia Repostería
// Conexión con Backend FastAPI y Base de Datos PostgreSQL / SQLite
// ===================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

/**
 * Extraer mensaje legible desde respuestas de error FastAPI / Pydantic
 */
function extractErrorMessage(data, status) {
  if (Array.isArray(data?.detail)) {
    return data.detail
      .map((err) => err?.msg || JSON.stringify(err))
      .join(' | ')
  }
  if (typeof data?.detail === 'string') return data.detail
  if (typeof data?.message === 'string') return data.message
  return `Error del servidor (${status})`
}

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
  } catch {
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
      return {
        ok: false,
        status: response.status,
        isNetworkError: false,
        error: extractErrorMessage(data, response.status)
      }
    }

    return { ok: true, data, status: response.status }
  } catch (error) {
    return {
      ok: false,
      status: 0,
      isNetworkError: true,
      error: 'No se pudo conectar con el servidor FastAPI. Verifica que el backend esté activo en http://localhost:8000.'
    }
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
// 2. Servicio de Autenticación y Recuperación
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
        rol_id: 3
      })
    })
  },

  async recoverPassword(email) {
    return await apiFetch('/auth/recover-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  },

  async resetPassword(token, newPassword) {
    return await apiFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword })
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

  async create(userData) {
    return await apiFetch('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
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
  },

  async create(categoryData) {
    return await apiFetch('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    })
  }
}

// -------------------------------------------------------------
// 6. Servicio de Pedidos
// -------------------------------------------------------------
export const orderService = {
  async getAll(params = {}) {
    const query = new URLSearchParams()
    if (params.estado) query.append('estado', params.estado)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return await apiFetch(`/orders${qs}`)
  },

  async create(orderData) {
    return await apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    })
  },

  async updateStatus(id, estado) {
    return await apiFetch(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ estado })
    })
  }
}

export default {
  API_BASE_URL,
  apiFetch,
  authService,
  userService,
  productService,
  categoryService,
  orderService,
  healthService
}
