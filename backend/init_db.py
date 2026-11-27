"""
Script de inicialización y carga de datos semilla en Neon Tech / PostgreSQL o SQLite
Uso:
  python init_db.py
"""

from datetime import datetime
from app.database import engine, Base, SessionLocal
from app.models import Rol, Permiso, Usuario, Categoria, Producto, Pedido, DetallePedido, roles_permisos
from app.security import get_password_hash

def seed_database():
    print("=" * 65)
    print("Inicializando Base de Datos - Dulce Delicia Repostería")
    print("=" * 65)

    # 1. Crear todas las tablas definidas en los modelos SQLAlchemy
    print("1. Creando tablas en la base de datos...")
    Base.metadata.create_all(bind=engine)
    print("   ✓ Tablas creadas / verificadas exitosamente.")

    db = SessionLocal()
    try:
        # 2. Sembrar Roles
        if db.query(Rol).count() == 0:
            print("2. Insertando roles del sistema...")
            roles = [
                Rol(id=1, nombre="Administrador", descripcion="Control total de la plataforma, usuarios y reportes.", activo=True),
                Rol(id=2, nombre="Empleado", descripcion="Gestión operativa de pedidos en cocina e inventario.", activo=True),
                Rol(id=3, nombre="Cliente", descripcion="Navegación del catálogo, órdenes y seguimiento.", activo=True)
            ]
            db.add_all(roles)
            db.commit()
            print("   ✓ 3 Roles creados.")
        else:
            print("   - Roles ya existentes.")

        # 3. Sembrar Permisos
        if db.query(Permiso).count() == 0:
            print("3. Insertando catálogo de permisos...")
            permisos = [
                Permiso(id=1, nombre="usuarios:listar", descripcion="Consultar usuarios", modulo="usuarios"),
                Permiso(id=2, nombre="usuarios:crear", descripcion="Registrar usuarios", modulo="usuarios"),
                Permiso(id=3, nombre="usuarios:editar", descripcion="Actualizar usuarios", modulo="usuarios"),
                Permiso(id=4, nombre="usuarios:eliminar", descripcion="Eliminar usuarios", modulo="usuarios"),
                Permiso(id=5, nombre="productos:listar", descripcion="Consultar postres", modulo="productos"),
                Permiso(id=6, nombre="productos:crear", descripcion="Crear postre", modulo="productos"),
                Permiso(id=7, nombre="productos:editar", descripcion="Modificar postre", modulo="productos"),
                Permiso(id=8, nombre="productos:eliminar", descripcion="Eliminar postre", modulo="productos"),
                Permiso(id=9, nombre="pedidos:listar", descripcion="Consultar pedidos", modulo="pedidos"),
                Permiso(id=10, nombre="pedidos:crear", descripcion="Generar pedido", modulo="pedidos"),
                Permiso(id=11, nombre="pedidos:actualizar_estado", descripcion="Cambiar estado", modulo="pedidos"),
                Permiso(id=12, nombre="pedidos:cancelar", descripcion="Cancelar pedido", modulo="pedidos"),
                Permiso(id=13, nombre="roles:gestionar", descripcion="Gestionar roles", modulo="roles"),
                Permiso(id=14, nombre="reportes:ver", descripcion="Visualizar balance y KPIs", modulo="reportes")
            ]
            db.add_all(permisos)
            db.commit()

            # Asignar permisos al Administrador (todos)
            admin_rol = db.query(Rol).filter(Rol.id == 1).first()
            if admin_rol:
                admin_rol.permisos = permisos
                db.commit()
            print("   ✓ 14 Permisos creados y asociados.")

        # 4. Sembrar Usuarios Iniciales
        if db.query(Usuario).count() == 0:
            print("4. Creando usuarios iniciales...")
            hashed_pwd = get_password_hash("Dulce2026*!")
            usuarios = [
                Usuario(
                    nombre="Valentina", apellido="Torres", tipo_documento="CC",
                    numero_documento="1098765432", telefono="3128904521",
                    direccion="Calle 45 # 24-10", email="admin@dulcedelicia.com",
                    password_hash=hashed_pwd, rol_id=1, activo=True
                ),
                Usuario(
                    nombre="Carlos", apellido="Mendoza", tipo_documento="CC",
                    numero_documento="1012345678", telefono="3157891234",
                    direccion="Carrera 15 # 32-45", email="empleado@dulcedelicia.com",
                    password_hash=hashed_pwd, rol_id=2, activo=True
                ),
                Usuario(
                    nombre="Sofía", apellido="Gómez", tipo_documento="CC",
                    numero_documento="1045678912", telefono="3182345678",
                    direccion="Avenida Las Palmas # 12-80", email="cliente@dulcedelicia.com",
                    password_hash=hashed_pwd, rol_id=3, activo=True
                )
            ]
            db.add_all(usuarios)
            db.commit()
            print("   ✓ Usuarios iniciales creados (Contraseña de prueba: Dulce2026*!).")

        # 5. Sembrar Categorías
        if db.query(Categoria).count() == 0:
            print("5. Creando categorías de postres...")
            categorias = [
                Categoria(id=1, nombre="Tortas Artesanales", descripcion="Bizcochos decorados a mano con frutas e ingredientes frescos.", activo=True),
                Categoria(id=2, nombre="Tartas & Cheesecakes", descripcion="Bases crocantes y rellenos cremosos horneados o fríos.", activo=True),
                Categoria(id=3, nombre="Postres Tradicionales", descripcion="Recetas caseras como tres leches, flanes y dulce de leche.", activo=True),
                Categoria(id=4, nombre="Postres de Café & Chocolate", descripcion="Creaciones intensas con café especial y chocolate puro.", activo=True)
            ]
            db.add_all(categorias)
            db.commit()
            print("   ✓ 4 Categorías creadas.")

        # 6. Sembrar los 10 Postres de Dulce Delicia
        if db.query(Producto).count() == 0:
            print("6. Insertando los 10 postres de la marca Dulce Delicia...")
            productos = [
                Producto(id=1, nombre="Torta Suprema de Arequipe", descripcion="Esponjoso bizcocho artesanal bañado con suave dulce de leche casero y delicada cubierta de crema chantilly.", precio=45000.00, stock=15, categoria_id=3, imagen_url="/src/assets/images/arequipe.jpg", activo=True),
                Producto(id=2, nombre="Tarta Helada de Café Moka", descripcion="Base crocante rellena de mousse aromatizada con granos de café de origen y virutas de chocolate semiamargo.", precio=48000.00, stock=12, categoria_id=4, imagen_url="/src/assets/images/cafe.jpg", activo=True),
                Producto(id=3, nombre="Delicia de Chocolate Belga", descripcion="Intensa tarta horneada con el más fino chocolate al 70%, centro húmedo fundente y ganache brillante.", precio=52000.00, stock=20, categoria_id=4, imagen_url="/src/assets/images/chocolate.jpg", activo=True),
                Producto(id=4, nombre="Cheesecake Suave de Durazno", descripcion="Cremosa base de queso crema horneado sobre galleta crujiente, coronado con duraznos en almíbar.", precio=50000.00, stock=14, categoria_id=2, imagen_url="/src/assets/images/durazno.png", activo=True),
                Producto(id=5, nombre="Flan Tradicional de la Casa", descripcion="Clásico flan casero preparado al baño de maría, textura sedosa, perfumado con vainilla y caramelo.", precio=35000.00, stock=18, categoria_id=3, imagen_url="/src/assets/images/flan.jpg", activo=True),
                Producto(id=6, nombre="Copa Tentación de Fresas", descripcion="Capas armoniosas de bizcochuelo tierno, crema batida dulce y fresas frescas seleccionadas.", precio=38000.00, stock=22, categoria_id=2, imagen_url="/src/assets/images/fresa.jpg", activo=True),
                Producto(id=7, nombre="Tarta Exótica de Maracuyá", descripcion="Equilibrio perfecto entre acidez y dulzura con mousse aireado de maracuyá y reducción de pulpa.", precio=46000.00, stock=16, categoria_id=2, imagen_url="/src/assets/images/maracuya.jpg", activo=True),
                Producto(id=8, nombre="Tarta Cremosa de Galletas Oreo", descripcion="Postre frío y cremoso elaborado con trozos abundantes de galleta negra y suave crema de vainilla.", precio=49000.00, stock=19, categoria_id=2, imagen_url="/src/assets/images/oreo.jpg", activo=True),
                Producto(id=9, nombre="Tiramisú Clásico Italiano", descripcion="Capas tradicionales humedecidas en infusión de espresso, crema de mascarpone y fino cacao.", precio=54000.00, stock=10, categoria_id=4, imagen_url="/src/assets/images/tiramisu.png", activo=True),
                Producto(id=10, nombre="Pastel Tres Leches Tradicional", descripcion="Bizcochuelo artesanal esponjoso embebido en nuestra mezcla de tres leches y merengue italiano.", precio=42000.00, stock=17, categoria_id=3, imagen_url="/src/assets/images/tres_leches.jpg", activo=True),
            ]
            db.add_all(productos)
            db.commit()
            print("   ✓ 10 Postres cargados exitosamente.")

        print("=" * 65)
        print("¡Inicialización completada con éxito!")
        print("=" * 65)

    except Exception as e:
        db.rollback()
        print(f"Error durante la inicialización: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
