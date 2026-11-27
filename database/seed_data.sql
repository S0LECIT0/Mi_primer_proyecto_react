-- ===================================================================
-- Sistema de Base de Datos Relacional: Dulce Delicia Repostería
-- Archivo: database/seed_data.sql
-- Descripción: Carga inicial de roles, permisos, usuarios, categorías,
--              los 10 postres de la marca y órdenes de prueba.
-- ===================================================================

-- -------------------------------------------------------------------
-- 1. POBLAR ROLES
-- -------------------------------------------------------------------
INSERT INTO roles (id, nombre, descripcion, activo) VALUES
(1, 'Administrador', 'Control total de la plataforma, usuarios, configuraciones y reportes generales.', 1),
(2, 'Empleado', 'Gestión operativa de pedidos en cocina, control de stock y catálogo de productos.', 1),
(3, 'Cliente', 'Navegación del catálogo, creación de órdenes y seguimiento de estado de compras.', 1);

-- -------------------------------------------------------------------
-- 2. POBLAR PERMISOS POR MÓDULOS
-- -------------------------------------------------------------------
INSERT INTO permisos (id, nombre, descripcion, modulo) VALUES
-- Módulo Usuarios
(1, 'usuarios:listar', 'Consultar el directorio de usuarios registrados', 'usuarios'),
(2, 'usuarios:crear', 'Registrar manualmente nuevos administradores o empleados', 'usuarios'),
(3, 'usuarios:editar', 'Actualizar datos y roles de usuarios existentes', 'usuarios'),
(4, 'usuarios:eliminar', 'Dar de baja o deshabilitar cuentas de usuario', 'usuarios'),
-- Módulo Productos
(5, 'productos:listar', 'Consultar la lista de postres y pasteles', 'productos'),
(6, 'productos:crear', 'Añadir nuevas creaciones de repostería a la vitrina virtual', 'productos'),
(7, 'productos:editar', 'Modificar precios, descripciones e inventario de productos', 'productos'),
(8, 'productos:eliminar', 'Retirar postres del catálogo activo', 'productos'),
-- Módulo Pedidos
(9, 'pedidos:listar', 'Consultar historial y bandeja de pedidos en curso', 'pedidos'),
(10, 'pedidos:crear', 'Generar una nueva orden de compra', 'pedidos'),
(11, 'pedidos:actualizar_estado', 'Cambiar el estado de preparación o entrega de una orden', 'pedidos'),
(12, 'pedidos:cancelar', 'Anular una orden de compra solicitada', 'pedidos'),
-- Módulo Configuración y Reportes
(13, 'roles:gestionar', 'Asignar o reconfigurar permisos y perfiles de seguridad', 'roles'),
(14, 'reportes:ver', 'Visualizar KPIs de ventas, métricas y balance de ingresos', 'reportes');

-- -------------------------------------------------------------------
-- 3. ASIGNAR PERMISOS A ROLES (roles_permisos)
-- -------------------------------------------------------------------
-- Administrador (todos los permisos: 1 al 14)
INSERT INTO roles_permisos (rol_id, permiso_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7),
(1, 8), (1, 9), (1, 10), (1, 11), (1, 12), (1, 13), (1, 14);

-- Empleado (operación de productos, pedidos y reportes)
INSERT INTO roles_permisos (rol_id, permiso_id) VALUES
(2, 5), (2, 6), (2, 7),
(2, 9), (2, 11),
(2, 14);

-- Cliente (ver catálogo, registrar orden y consultar sus pedidos)
INSERT INTO roles_permisos (rol_id, permiso_id) VALUES
(3, 5),
(3, 9),
(3, 10);

-- -------------------------------------------------------------------
-- 4. POBLAR USUARIOS INICIALES
-- Nota: Contraseñas de prueba cifradas con Bcrypt (passwords tipo: Dulce2026*!)
-- -------------------------------------------------------------------
INSERT INTO usuarios (id, nombre, apellido, tipo_documento, numero_documento, telefono, direccion, email, password_hash, rol_id, activo) VALUES
(1, 'Valentina', 'Torres', 'CC', '1098765432', '3128904521', 'Calle 45 # 24-10, Pastelería Dulce Delicia', 'admin@dulcedelicia.com', '$2b$12$e8YkCfq13jT0Gq48W3Bsk.tT4d4nJ3N/O.JmK27Jg8q5RkGSmEkeS', 1, 1),
(2, 'Carlos', 'Mendoza', 'CC', '1012345678', '3157891234', 'Carrera 15 # 32-45, Barrio Central', 'empleado@dulcedelicia.com', '$2b$12$e8YkCfq13jT0Gq48W3Bsk.tT4d4nJ3N/O.JmK27Jg8q5RkGSmEkeS', 2, 1),
(3, 'Sofía', 'Gómez', 'CC', '1045678912', '3182345678', 'Avenida Las Palmas # 12-80', 'cliente@dulcedelicia.com', '$2b$12$e8YkCfq13jT0Gq48W3Bsk.tT4d4nJ3N/O.JmK27Jg8q5RkGSmEkeS', 3, 1),
(4, 'Andrés', 'Restrepo', 'CC', '1023456789', '3209876543', 'Diagonal 68 # 45-12, Apto 302', 'andres.restrepo@example.com', '$2b$12$e8YkCfq13jT0Gq48W3Bsk.tT4d4nJ3N/O.JmK27Jg8q5RkGSmEkeS', 3, 1);

-- -------------------------------------------------------------------
-- 5. POBLAR CATEGORÍAS DE REPOSTERÍA
-- -------------------------------------------------------------------
INSERT INTO categorias (id, nombre, descripcion, activo) VALUES
(1, 'Tortas Artesanales', 'Bizcochos esponjosos y decorados a mano con cremas y frutas seleccionadas.', 1),
(2, 'Tartas & Cheesecakes', 'Bases crujientes horneadas combinadas con rellenos suaves, queso crema y pulpas naturales.', 1),
(3, 'Postres Tradicionales', 'Recetas emblemáticas caseras: tres leches, flanes horneados al caramelo y dulce de leche.', 1),
(4, 'Postres de Café & Chocolate', 'Creaciones intensas elaboradas con café premium seleccionado y chocolate belga de alta pureza.', 1);

-- -------------------------------------------------------------------
-- 6. POBLAR LOS 10 POSTRES DEL CATÁLOGO "DULCE DELICIA"
-- (Mismas especialidades presentes en el carrusel y vitrina visual)
-- -------------------------------------------------------------------
INSERT INTO productos (id, nombre, descripcion, precio, stock, categoria_id, imagen_url, activo) VALUES
(1, 'Torta Suprema de Arequipe', 'Esponjoso bizcocho artesanal bañado con suave dulce de leche casero y delicada cubierta de crema chantilly.', 45000.00, 15, 3, '/src/assets/images/arequipe.jpg', 1),
(2, 'Tarta Helada de Café Moka', 'Base crocante rellena de mousse aromatizada con granos de café de origen y virutas de chocolate semiamargo.', 48000.00, 12, 4, '/src/assets/images/cafe.jpg', 1),
(3, 'Delicia de Chocolate Belga', 'Intensa tarta horneada con el más fino chocolate al 70%, centro húmedo fundente y ganache brillante.', 52000.00, 20, 4, '/src/assets/images/chocolate.jpg', 1),
(4, 'Cheesecake Suave de Durazno', 'Cremosa base de queso crema horneado sobre galleta crujiente, coronado con una generosa capa de duraznos en almíbar.', 50000.00, 14, 2, '/src/assets/images/durazno.png', 1),
(5, 'Flan Tradicional de la Casa', 'Clásico flan casero preparado al baño de maría, textura sedosa, perfumado con vainilla natural y caramelo dorado.', 35000.00, 18, 3, '/src/assets/images/flan.jpg', 1),
(6, 'Copa Tentación de Fresas', 'Capas armoniosas de bizcochuelo tierno, crema batida dulce y fresas frescas seleccionadas en su punto ideal de madurez.', 38000.00, 22, 2, '/src/assets/images/fresa.jpg', 1),
(7, 'Tarta Exótica de Maracuyá', 'Equilibrio perfecto entre acidez y dulzura: base crujiente con mousse aireado de maracuyá y reducción de pulpa con semillas.', 46000.00, 16, 2, '/src/assets/images/maracuya.jpg', 1),
(8, 'Tarta Cremosa de Galletas Oreo', 'Postre frío y cremoso elaborado con trozos abundantes de galleta negra americana y suave crema de vainilla.', 49000.00, 19, 2, '/src/assets/images/oreo.jpg', 1),
(9, 'Tiramisú Clásico Italiano', 'Capas tradicionales de galletas savoiardi humedecidas en infusión de espresso y licor dulce, entre crema de mascarpone y cacao puro.', 54000.00, 10, 4, '/src/assets/images/tiramisu.png', 1),
(10, 'Pastel Tres Leches Tradicional', 'Bizcochuelo artesanal esponjoso embebido en nuestra exclusiva mezcla de tres leches y decorado con merengue italiano flameado.', 42000.00, 17, 3, '/src/assets/images/tres_leches.jpg', 1);

-- -------------------------------------------------------------------
-- 7. POBLAR PEDIDOS DE PRUEBA
-- -------------------------------------------------------------------
INSERT INTO pedidos (id, usuario_id, total, estado, metodo_pago, direccion_entrega, notas, fecha_pedido) VALUES
(1, 3, 83000.00, 'Entregado', 'Transferencia', 'Avenida Las Palmas # 12-80', 'Entregar en portería con dedicatoria de feliz cumpleaños', '2026-11-20 14:30:00'),
(2, 4, 96000.00, 'En Preparacion', 'Tarjeta', 'Diagonal 68 # 45-12, Apto 302', 'Favor empacar con cinta de regalo rosa', '2026-11-26 10:15:00'),
(3, 3, 52000.00, 'Pendiente', 'ContraEntrega', 'Avenida Las Palmas # 12-80', 'Confirmar hora estimada de llegada por WhatsApp', '2026-11-26 16:45:00');

-- -------------------------------------------------------------------
-- 8. POBLAR DETALLE DE PEDIDOS
-- -------------------------------------------------------------------
-- Pedido 1: Torta Suprema de Arequipe (45000) + Copa Tentación de Fresas (38000) = 83000
INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 1, 45000.00, 45000.00),
(1, 6, 1, 38000.00, 38000.00);

-- Pedido 2: Tiramisú Clásico Italiano (54000) + Pastel Tres Leches Tradicional (42000) = 96000
INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(2, 9, 1, 54000.00, 54000.00),
(2, 10, 1, 42000.00, 42000.00);

-- Pedido 3: Delicia de Chocolate Belga (52000) = 52000
INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(3, 3, 1, 52000.00, 52000.00);
