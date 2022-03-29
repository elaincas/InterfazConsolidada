
import { IMenuItem, ISideBar, IMenu } from './menu.model';

export module sidebarRoutes {
  const MENU_PRODUCTOS: IMenu = {
    title: 'Productos',
    icon: 'material-icons',
    iconName: 'apps',
    visible: false,
    opciones: [
      {
        pantallaId: 0,
        title: 'Tags',
        icon: 'material-icons',
        iconName: 'bookmark',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 16,
            title: 'Asignar Tags',
            icon: 'material-icons',
            iconName: 'loyalty',
            path: '/productos/tags/asignar',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Categorías',
        icon: 'material-icons',
        iconName: 'class',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 3,
            title: 'Crear Categoría',
            icon: 'material-icons',
            iconName: 'add_circle',
            path: '/productos/categoria/crear',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 7,
            title: 'Ver Categorías',
            icon: 'material-icons',
            iconName: 'list',
            path: '/productos/categorias',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Características',
        icon: 'material-icons',
        iconName: 'widgets',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 7,
            title: 'Agregar Características',
            icon: 'material-icons',
            iconName: 'add_circle_outline',
            path: '/productos/caracteristica/agregar',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 7,
            title: 'Ver Características',
            icon: 'material-icons',
            iconName: 'list',
            path: '/productos/caracteristica/listado',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Bandeos',
        icon: 'material-icons',
        iconName: 'markunread_mailbox',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 306,
            title: 'Bandear Productos',
            icon: 'material-icons',
            iconName: 'linear_scale',
            path: '/productos/bandeos',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Precios',
        icon: 'material-icons',
        iconName: 'local_atm',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 351,
            title: 'Administrar Productos',
            icon: 'material-icons',
            iconName: 'linear_scale',
            path: '/productos/precios',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 357,
            title: 'Administrar Productos Global',
            icon: 'material-icons',
            iconName: 'linear_scale',
            path: '/productos/preciosglobal',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Productos Alternativos',
        icon: 'material-icons',
        iconName: 'article',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 445,
            title: 'Rerporte Comparativo',
            icon: 'material-icons',
            iconName: 'linear_scale',
            path: '/productos/reporte-comparativo',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 351,
            title: 'Administrar Productos Alternativos',
            icon: 'material-icons',
            iconName: 'linear_scale',
            path: '/productos/alternativos',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 351,
            title: 'Administrar Productos Individuales',
            icon: 'material-icons',
            iconName: 'linear_scale',
            path: '/productos/individuales',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Descuentos Adicionales',
        icon: 'material-icons',
        iconName: 'local_offer',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 491,
            title: 'Agregar Descuentos Adicionales',
            icon: 'material-icons',
            iconName: 'add_circle',
            path: '/productos/descuentos-adicionales/agregar',
            visible: true,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 492,
            title: 'Consultar Descuentos Adicionales',
            icon: 'material-icons',
            iconName: 'list_alt',
            path: '/productos/descuentos-adicionales/consultar',
            visible: true,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Productos con Descuentos Exclusivos',
        icon: 'material-icons',
        iconName: 'attach_money',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 406,
            title: 'Administrar Productos con Descuentos Exclusivos',
            icon: 'font',
            iconName: 'linear_scale',
            path: '/productos/descuentos-exclusivos',
            visible: true,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Configuracion Productos UI',
        icon: 'material-icons',
        iconName: 'article',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 407,
            title: 'Configurar Productos Pedidos UI',
            icon: 'material-icons',
            iconName: 'linear_scale',
            path: '/productos/configuracion-pedidosUI',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },

        ],
      },
      {
        pantallaId: 0,
        title: 'Productos Restingidos',
        icon: 'material-icons',
        iconName: 'production_quantity_limits',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 471,
            title: 'Administrar de Productos Restringidos en Envíos Internacionales',
            icon: 'font',
            iconName: 'linear_scale',
            path: '/productos/restringidos',
            visible: true,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Información de Productos',
        icon: 'material-icons',
        iconName: 'info',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 479,
            title: 'Administrar Paneles de Información',
            icon: 'font',
            iconName: 'credit_card',
            path: '/productos/informacion-productos',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 480,
            title: 'Administrar Subsecciones',
            icon: 'font',
            iconName: 'subject',
            path: '/productos/informacion-productos/secciones',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 481,
            title: 'Subsecciones de Productos',
            icon: 'font',
            iconName: 'view_module',
            path: '/productos/informacion-productos/seccion-productos',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Reporte',
        icon: 'material-icons',
        iconName: 'list',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 484,
            title: 'Reproducion de Video',
            icon: 'font',
            iconName: 'ondemand_video',
            path: '/productos/videos/reporte',
            visible: true,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Presentaciones de Productos',
        icon: 'material-icons',
        iconName: 'article',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 508,
            title: 'Administrar Presentaciones de Productos',
            icon: 'material-icons',
            iconName: 'linear_scale',
            path: '/productos/presentaciones',
            visible: true,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
    ],
  };

  const MENU_REEMBOLSOS: IMenu = {
    title: 'Reembolsos',
    icon: 'material-icons',
    iconName: 'apps',
    visible: false,
    opciones: [
      {
        pantallaId: 5,
        title: 'Ingresar reembolso',
        icon: 'material-icons',
        iconName: 'attach_money',
        path: '/entrenamiento/reembolsos/ingresotransporte',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 6,
        title: 'Listados de Reembolso',
        icon: 'material-icons',
        iconName: 'list',
        path: '/entrenamiento/reembolsos/listadoreembolso',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 0,
        title: 'Reportes',
        icon: 'material-icons',
        iconName: 'list_alt',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 8,
            title: 'Compensación',
            icon: 'material-icons',
            iconName: 'card_giftcard',
            path: '/entrenamiento/reembolsos/reportes/compensacion',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },

          {
            pantallaId: 10,
            title: 'Estado de reembolsos',
            icon: 'material-icons',
            iconName: 'visibility',
            path: '/entrenamiento/reembolsos/reportes/estados',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
    ],
  };
  const MENU_PRODUCTOS_ENTRENAMIENTO: IMenu = {
    title: 'Productos Entrenamiento',
    icon: 'material-icons',
    iconName: 'apps',
    visible: false,
    opciones: [
      {
        pantallaId: 504,
        title: 'Ingresar Producto',
        icon: 'material-icons',
        iconName: 'move_to_inbox',
        path: '/entrenamiento/productos/ingresarproducto',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 0,
        title: 'Asignación Productos',
        icon: 'material-icons',
        iconName: 'assignment_ind',
        path: '/entrenamiento/productos/asignacion',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 0,
        title: 'Asignar Zona',
        icon: 'material-icons',
        iconName: 'person_pin_circle',
        path: '/entrenamiento/productos/asignarzona',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 0,
        title: 'Trasladar Productos',
        icon: 'material-icons',
        iconName: 'compare_arrows',
        path: '/entrenamiento/productos/trasladarproducto',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 0,
        title: 'Aceptar/Denegar Traslado',
        icon: 'material-icons',
        iconName: 'check_circle',
        path: '/entrenamiento/productos/aceptardenegartraslado',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 0,
        title: 'Reportes Productos',
        icon: 'material-icons',
        iconName: 'list_alt',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 0,
            title: 'Disponibles Para Asignar',
            icon: 'material-icons',
            iconName: 'queue',
            path: '/entrenamiento/productos/reportes/disponibles',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 0,
            title: 'Transacciones Colaboradores',
            icon: 'material-icons',
            iconName: 'assignment_ind',
            path: '/entrenamiento/productos/reportes/transacciones',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 0,
            title: 'Auxiliar Producto',
            icon: 'material-icons',
            iconName: 'assignment',
            path: '/entrenamiento/productos/reportes/auxiliarproductos',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 0,
            title: 'Producto Mal Estado/Perdido',
            icon: 'material-icons',
            iconName: 'image_search',
            path: '/entrenamiento/productos/reportes/malestadoperdidos',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
    ],
  };
  const MENU_ECOMMERCE: IMenu = {
    title: 'Ecommerce',
    icon: 'material-icons',
    iconName: 'shopping_cart',
    visible: false,
    opciones: [
      {
        pantallaId: 15,
        title: 'Dashboard',
        icon: 'material-icons',
        iconName: 'dashboard',
        path: '/ecommerce/dashboard',
        visible: false,
        subMenu: [],
      },
      {
        pantallaId: 0,
        title: 'Usuarios',
        icon: 'material-icons',
        iconName: 'people',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 185,
            title: 'Administración',
            icon: 'material-icons',
            iconName: 'how_to_reg',
            path: '/ecommerce/usuarios',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 402,
            title: 'Bloqueo de procesos',
            icon: 'material-icons',
            iconName: 'block',
            path: '/ecommerce/usuarios/bloqueoDeProcesos',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          }
        ],
      },
      {
        pantallaId: 0,
        title: 'Banners',
        icon: 'material-icons',
        iconName: 'panorama',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 16,
            title: 'Subir Banner',
            icon: 'material-icons',
            iconName: 'file_upload',
            path: '/ecommerce/banners/subirbanner',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 17,
            title: 'Lista de Banners',
            icon: 'material-icons',
            iconName: 'list',
            path: '/ecommerce/banners/lista-banners',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Productos de Carrusel',
        icon: 'material-icons',
        iconName: 'view_carousel',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 86,
            title: 'Agregar Productos a Carrusel',
            icon: 'material-icons',
            iconName: 'add_circle_outline',
            path: '/ecommerce/productosCarrusel/agregar',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 88,
            title: 'Lista de Carruseles',
            icon: 'material-icons',
            iconName: 'list',
            path: '/ecommerce/productosCarrusel/listadoCarruseles',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Servicios',
        icon: 'material-icons',
        iconName: 'assignment',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 203,
            title: 'Agregar Servicio',
            icon: 'material-icons',
            iconName: 'add_circle_outline',
            path: '/ecommerce/servicios/agregar',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 204,
            title: 'Lista de Servicios',
            icon: 'material-icons',
            iconName: 'list',
            path: '/ecommerce/servicios/listadoServicios',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },

      {
        pantallaId: 0,
        title: 'Servicios Disponibles',
        icon: 'material-icons',
        iconName: 'build',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 443,
            title: 'Lista de Servicios',
            icon: 'material-icons',
            iconName: 'list',
            path: '/ecommerce/servicios/listaServiciosDisponibles',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },


      {
        pantallaId: 0,
        title: 'Distribuidores Externos',
        icon: 'material-icons',
        iconName: 'transfer_within_a_station',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 86,
            title: 'Administrar Categorías',
            icon: 'material-icons',
            iconName: 'add_circle_outline',
            path: '/ecommerce/distribuidoresexternos/admincategorias',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 88,
            title: 'Administrar Productos a Categoría',
            icon: 'material-icons',
            iconName: 'add_circle_outline',
            path: '/ecommerce/distribuidoresexternos/adminproductoscategorias',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 88,
            title: 'Administrar Sucursales Habilitadas',
            icon: 'material-icons',
            iconName: 'add_circle_outline',
            path:
              '/ecommerce/distribuidoresexternos/adminsucursaleshabilitadas',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'EconoMascotas',
        icon: 'material-icons',
        iconName: 'pets',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 413,
            title: 'Admin. Atributos Productos',
            icon: 'material-icons',
            iconName: 'category',
            path: '/ecommerce/economascotas/administracionatributos',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          }
        ],
      },
      {
        pantallaId: 0,
        title: 'Notificaciones Push',
        icon: 'material-icons',
        iconName: 'notifications_active',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 291,
            title: 'Listado de Notificaciones',
            icon: 'material-icons',
            iconName: 'list',
            path: '/ecommerce/notificaciones/listado',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          // ,
          // {
          //   pantallaId: 204,
          //   title: "Lista de Servicios",
          //   icon: "material-icons",
          //   iconName: "list",
          //   path: "/ecommerce/servicios/listadoServicios",
          //   visible: false,
          //   subMenu: new Array<IMenuItem>()
          // }
        ],
      },
      {
        pantallaId: 0,
        title: 'Suscríbete y Ahorra',
        icon: 'material-icons',
        iconName: 'forward_30',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 334,
            title: 'Listado de pedidos',
            icon: 'material-icons',
            iconName: 'list',
            path: '/ecommerce/recompra/listado',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 335,
            title: 'Administrar productos',
            icon: 'material-icons',
            iconName: 'settings',
            path: '/ecommerce/recompra/configuraciones',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 371,
            title: 'Reporte de Ventas',
            icon: 'material-icons',
            iconName: 'assignment',
            path: '/ecommerce/recompra/reporteDeVentas',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 372,
            title: 'Reporte de Clientes Suscritos',
            icon: 'material-icons',
            iconName: 'assignment_ind',
            path: '/ecommerce/recompra/reporteClientesSuscritos',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 373,
            title: 'Resumen de Ventas',
            icon: 'material-icons',
            iconName: 'analytics',
            path: '/ecommerce/recompra/resumenDeVenta',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Archivos de Productos',

        icon: 'material-icons',
        iconName: 'production_quantity_limits',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 291,
            title: 'Subir Archivos de Productos',
            icon: 'material-icons',
            iconName: 'list',
            path: '/ecommerce/archivos/admin',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          // ,
          // {
          //   pantallaId: 204,
          //   title: "Lista de Servicios",
          //   icon: "material-icons",
          //   iconName: "list",
          //   path: "/ecommerce/servicios/listadoServicios",
          //   visible: false,
          //   subMenu: new Array<IMenuItem>()
          // }
        ],
      },
      {
        pantallaId: 504,
        title: 'Monitoreo de Limite de transacciones',
        icon: 'material-icons',
        iconName: 'ballot',
        path: '/ecommerce/monitoreo-limite-transacciones',
        visible: true,
        subMenu: new Array<IMenuItem>()
           // ,
          // {
          //   pantallaId: 204,
          //   title: "Lista de Servicios",
          //   icon: "material-icons",
          //   iconName: "list",
          //   path: "/ecommerce/servicios/listadoServicios",
          //   visible: false,
          //   subMenu: new Array<IMenuItem>()
          // }

      },
    ],
  };
  const MENU_INVENTARIO_IMPULSOS: IMenu = {
    title: 'Productos Impulsados',
    icon: 'material-icons',
    iconName: 'redeem',
    visible: false,
    opciones: [
      {
        pantallaId: 39,
        title: 'Crear Producto',
        icon: 'material-icons',
        iconName: 'add_circle',
        path: '/desarrolloproductos/inventarioimpulso/crearproducto',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 40,
        title: 'Ingreso Producto',
        icon: 'material-icons',
        iconName: 'inventory',
        path: '/desarrolloproductos/inventarioimpulso/ingresoproducto',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 41,
        title: 'Trasladar Producto',
        icon: 'material-icons',
        iconName: 'local_shipping',
        path: '/desarrolloproductos/inventarioimpulso/trasladarproducto',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 43,
        title: 'Salidas Inventario',
        icon: 'material-icons',
        iconName: 'outbox',
        path: '/desarrolloproductos/inventarioimpulso/recepciontraslados',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 476,
        title: 'Reporte Ingresos Productos',
        icon: 'material-icons',
        iconName: 'summarize',
        path: '/desarrolloproductos/inventarioimpulso/reporteIngresoProductos',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 483,
        title: 'Ingreso Productos Sucursal',
        icon: 'material-icons',
        iconName: 'input',
        path: '/desarrolloproductos/inventarioimpulso/ingresotrasladosucursal',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 0,
        title: 'Reportes',
        icon: 'material-icons',
        iconName: 'list',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 42,
            title: 'Listado Inventario',
            icon: 'material-icons',
            iconName: 'view_list',
            path: '/desarrolloproductos/inventarioimpulso/listadoinventario',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },

          {
            pantallaId: 44,
            title: 'Inventario Sucursal',
            icon: 'material-icons',
            iconName: 'view_list',
            path: '/desarrolloproductos/inventarioimpulso/inventariosucursal',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
    ],
  };

  const MENU_MERCADEO: IMenu = {
    title: 'Mercadeo',
    icon: 'material-icons',
    iconName: 'store_mall_directory',
    visible: false,
    opciones: [
      {
        pantallaId: 0,
        title: 'Cupones Digitales',
        icon: 'material-icons',
        iconName: 'card_giftcard',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 21,
            title: 'Admin Cupones Digitales',
            icon: 'material-icons',
            iconName: 'add_circle_outline',
            path: '/mercadeo/cupones/adminiCupones',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Encuesta a Usuarios',
        icon: 'material-icons',
        iconName: 'question_answer',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 378,
            title: 'Administración',
            icon: 'material-icons',
            iconName: 'add_circle_outline',
            path: '/mercadeo/encuestas/adminiEncuestaPedidos',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 386,
            title: 'Reporte Satisfecho/Insatisfecho',
            icon: 'material-icons',
            iconName: 'sentiment_satisfied_alt',
            path: '/mercadeo/encuestas/reporteEncuestaPedidos',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 387,
            title: 'Reporte NPS',
            icon: 'material-icons',
            iconName: 'score',
            path: '/mercadeo/encuestas/reporteNPSEncuestasPedidos',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
    ],
  };

  const MENU_PLANIEMTRIAS: IMenu = {
    title: 'Planimetrías',
    icon: 'material-icons',
    iconName: 'store_mall_directory',
    visible: false,
    opciones: [
      {
        pantallaId: 89,
        title: 'Nueva Planimetría',
        icon: 'material-icons',
        iconName: 'new_releases',
        path: '/desarrolloproductos/planimetria/ingresarplanimetria',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 163,
        title: 'Visualizar y Retroalimentar',
        icon: 'material-icons',
        iconName: 'new_releases',
        path: '/desarrolloproductos/planimetria/retroalimentarplanimetria',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 0,
        title: 'Reportes',
        icon: 'material-icons',
        iconName: 'list_alt',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 164,
            title: 'Retroalimetación Sucursales',
            icon: 'material-icons',
            iconName: 'autorenew',
            path:
              '/desarrolloproductos/planimetria/reportes/retroalimetancionsucursales',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
    ],
  };
  const MENU_CONFIGURACIONES_FARMACIA: IMenu = {
    title: 'Configuraciones farmacia',
    icon: 'material-icons',
    iconName: 'settings',
    visible: false,
    opciones: [
      {
        pantallaId: 188,
        title: 'Ingresar imagenes formato impreso facturas',
        icon: 'material-icons',
        iconName: 'print',
        path: '/ConfiguracionesFarmacia/SubirImagenesFacturaImpresa',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 0,
        title: 'Descuentos Adicionales',
        icon: 'material-icons',
        iconName: 'local_offer',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 384,
            title: 'Configurar Nuevo',
            icon: 'material-icons',
            iconName: 'add_circle_outline',
            path: '/ConfiguracionesFarmacia/DescuentosAdicionales',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 385,
            title: 'Ver Descuentos',
            icon: 'material-icons',
            iconName: 'list_alt',
            path: '/ConfiguracionesFarmacia/ListadoDescuentosAdicionales',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
    ],
  };

  const MENU_MAESTROS_FARMACIA: IMenu = {
    title: 'Maestros',
    icon: 'material-icons',
    iconName: 'settings',
    visible: false,
    opciones: [
      {
        pantallaId: 0,
        title: 'Colonias',
        icon: 'material-icons',
        iconName: 'menu_book',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 363,
            title: 'Corección de Nombres',
            icon: 'material-icons',
            iconName: 'edit',
            path: '/maestros/colonias/correccionNombres',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 363,
            title: 'Colonias Editar SAD',
            icon: 'material-icons',
            iconName: 'post_add',
            path: '/maestros/colonias/coloniasSADEditar',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 478,
            title: 'Administrar colonias',
            icon: 'material-icons',
            iconName: 'post_add',
            path: '/maestros/colonias/administrar',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Políticas Vencimiento',
        icon: 'material-icons',
        iconName: 'menu_book',
        path: '#',
        visible: false,
        subMenu: [
          {
            pantallaId: 398,
            title: 'Políticas',
            icon: 'material-icons',
            iconName: 'post_add',
            path: '/maestros/politicas-vencimiento/politicas',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Listas de precios',
        icon: 'material-icons',
        iconName: 'payments',
        path: '#',
        visible: false,
        subMenu: [
          {
            pantallaId: 447,
            title: 'Administración',
            icon: 'material-icons',
            iconName: 'price_check',
            path: '/maestros/listas-precios/administracion',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Variables de Configuración',
        icon: 'material-icons',
        iconName: 'payments',
        path: '#',
        visible: false,
        subMenu: [
          {
            pantallaId: 509,
            title: 'Administración',
            icon: 'material-icons',
            iconName: 'attach_money',
            path: '/maestros/variables-de-configuracion/administracion',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Sellos de Sucursales',
        icon: 'material-icons',
        iconName: 'approval',
        path: '#',
        visible: false,
        subMenu: [
          {
            pantallaId: 497,
            title: 'Administrar Sellos',
            icon: 'material-icons',
            iconName: 'description',
            path: '/maestros/sucursales-sellos/administracion',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Firmas de Agentes',
        icon: 'material-icons',
        iconName: 'history_edu',
        path: '#',
        visible: false,
        subMenu: [
          {
            pantallaId: 498,
            title: 'Administrar Firmas',
            icon: 'material-icons',
            iconName: 'description',
            path: '/maestros/agentes-firmas/administracion',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Administración Recargas',
        icon: 'material-icons',
        iconName: 'smartphone',
        path: '#',
        visible: false,
        subMenu: [
          {
            pantallaId: 451,
            title: 'Administración',
            icon: 'material-icons',
            iconName: 'settings',
            path: '/maestros/recargas-telefonicas/administracion',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Consultorios',
        icon: 'material-icons',
        iconName: 'medical_services',
        path: '#',
        visible: false,
        subMenu: [
          {
            pantallaId: 451,
            title: 'Administración',
            icon: 'material-icons',
            iconName: 'settings',
            path: '/maestros/consultorios/administracion',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 0,
        title: "Stickers",
        icon: "fa",
        iconName: "fa-sticky-note",
        path: "#",
        visible: false,
        subMenu: [
          {
            pantallaId: 493,
            title: "Listado de Stickers",
            icon: "material-icons",
            iconName: "view_list",
            path: "/maestros/stickers/listadoDeStickers",
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 0,
            title: "Configuraciones",
            icon: "material-icons",
            iconName: "settings",
            path: "",
            visible: false,
            subMenu: [
              {
                pantallaId: 493,
                title: "Configuración de Stickers",
                icon: "fa",
                iconName: "fa-sticky-note",
                path: "/maestros/stickers/configuracion",
                visible: false,
                subMenu: new Array<IMenuItem>(),
              },
              {
                pantallaId: 0,
                title: "Editar Sticker",
                icon: "fa",
                iconName: "fa-sticky-note",
                path: "/maestros/stickers/configuracion/:id",
                visible: false,
                subMenu: new Array<IMenuItem>(),
              },
              {
                pantallaId: 494,
                title: "Premios Por Stickers",
                icon: "material-icons",
                iconName: "apps",
                path: "/maestros/stickers/stickers-premios",
                visible: false,
                subMenu: new Array<IMenuItem>(),
              },
            ],
          },
          {
            pantallaId: 0,
            title: "Premios",
            icon: "material-icons",
            iconName: "card_giftcard",
            path: "",
            visible: false,
            subMenu: [
              {
                pantallaId: 494,
                title: "Productos",
                icon: "material-icons",
                iconName: "apps",
                path: "/maestros/stickers/premios",
                visible: false,
                subMenu: new Array<IMenuItem>(),
              },
            ],
          },
          {
            pantallaId: 0,
            title: "Clientes",
            icon: "material-icons",
            iconName: "group",
            path: "",
            visible: false,
            subMenu: [
              {
                pantallaId: 496,
                title: "Stickers Por Descuentos",
                icon: "material-icons",
                iconName: "attach_money",
                path: "/maestros/stickers/stickers-por-descuentos",
                visible: false,
                subMenu: new Array<IMenuItem>(),
              },
            ],
          },
        ],
      },
      {
        pantallaId: 0,
        title: 'Distribuidores',
        icon: 'material-icons',
        iconName: 'local_shipping',
        path: '#',
        visible: false,
        subMenu: [
          {
            pantallaId: 505,
            title: 'Envío De Compra Por Correo a Distribuidores',
            icon: 'material-icons',
            iconName: 'email',
            path: '/maestros/distribuidores-compras-digitales/administracion',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
    ],
  };

  const MENU_ANALISIS_CLINICO: IMenu = {
    title: 'Análisis Clinicos',
    icon: 'material-icons',
    iconName: 'science',
    visible: false,
    opciones: [
      {
        pantallaId: 428,
        title: 'Análisis',
        icon: 'material-icons',
        iconName: 'folder',
        path: '/AnalisisClinicos/Analisis',
        visible: false,
        subMenu: [
          {
            pantallaId: 428,
            title: 'Registrar Nuevo',
            icon: 'material-icons',
            iconName: 'add_circle',
            path: '/AnalisisClinicos/NuevoAnalisis',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 428,
            title: 'Lista Análisis',
            icon: 'material-icons',
            iconName: 'view_list',
            path: '/AnalisisClinicos/Analisis',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 429,
        title: 'Parámetros',
        icon: 'material-icons',
        iconName: 'folder',
        path: '/AnalisisClinicos/Parametros',
        visible: false,
        subMenu: [
          {
            pantallaId: 429,
            title: 'Registrar Nuevo',
            icon: 'material-icons',
            iconName: 'add_circle',
            path: '/AnalisisClinicos/NuevoParametro',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
          {
            pantallaId: 429,
            title: 'Lista Parámetros',
            icon: 'material-icons',
            iconName: 'view_list',
            path: '/AnalisisClinicos/Parametros',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
      {
        pantallaId: 430,
        title: 'Insumos',
        icon: 'material-icons',
        iconName: 'view_list',
        path: '/AnalisisClinicos/Insumos',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 431,
        title: 'Laboratorios',
        icon: 'material-icons',
        iconName: 'view_list',
        path: '/AnalisisClinicos/Laboratorios',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 432,
        title: 'Requisitos',
        icon: 'material-icons',
        iconName: 'view_list',
        path: '/AnalisisClinicos/Requisitos',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 433,
        title: 'Unidades Medida',
        icon: 'material-icons',
        iconName: 'view_list',
        path: '/AnalisisClinicos/UnidadesMedida',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 434,
        title: 'Tipos Muestra',
        icon: 'material-icons',
        iconName: 'view_list',
        path: '/AnalisisClinicos/TiposMuestras',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 435,
        title: 'Análisis Categorías',
        icon: 'material-icons',
        iconName: 'view_list',
        path: '/AnalisisClinicos/AnalisisCategorias',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 436,
        title: 'Grupos',
        icon: 'material-icons',
        iconName: 'view_list',
        path: '/AnalisisClinicos/ParametrosGrupos',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 0,
        title: 'Reportes',
        icon: 'material-icons',
        iconName: 'table_view',
        path: '',
        visible: false,
        subMenu: [
          {

            pantallaId: 453,
            title: 'Facturas por Call Center',
            icon: 'material-icons',
            iconName: 'settings_phone',
            path: '/AnalisisClinicos/Reporte/Facturas/Call-center',
            visible: false,
            subMenu:  new Array<IMenuItem>(),
          }
        ]
      }
    ],
  };

  const MENU_SAD: IMenu = {
    title: 'SAD',
    icon: 'material-icons',
    iconName: 'store_mall_directory',
    visible: true,
    opciones: [
      {
        pantallaId: 511,
        title: 'Dashboard',
        icon: 'material-icons',
        iconName: 'dashboard',
        path: '/sad/dashboard',
        visible: false,
        subMenu: [],
      },
      {
        pantallaId: 464,
        title: 'Administrar conserjes',
        icon: 'material-icons',
        iconName: 'people',
        path: '/sad/conserjes',
        visible: true,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 477,
        title: 'Mapa de conserjes',
        icon: 'material-icons',
        iconName: 'map',
        path: '/sad/mapa-conserjes',
        visible: true,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 482,
        title: 'Administracion de pedidos',
        icon: 'material-icons',
        iconName: 'local_shipping',
        path: '/sad/administracion-pedidos',
        visible: true,
        subMenu: new Array<IMenuItem>(),
      },
    ],
  };



  const MENU_INVENTARIO_REMOTOS: IMenu = {
    title: 'Inventarios Remotos',
    icon: 'material-icons',
    iconName: 'cloud_circle',
    visible: false,
    opciones: [
      {
        pantallaId: 462,
        title: 'Traslado de Producto',
        icon: 'material-icons',
        iconName: 'markunread_mailbox',
        path: '/InventariosRemotos/Traslados',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 463,
        title: 'Auxiliar de Producto',
        icon: 'material-icons',
        iconName: 'transform',
        path: '/InventariosRemotos/Auxiliar',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
      {
        pantallaId: 463,
        title: 'Devolver Traslado',
        icon: 'material-icons',
        iconName: 'transform',
        path: '/InventariosRemotos/devolver-traslado',
        visible: false,
        subMenu: new Array<IMenuItem>(),
      },
    ]
  };

  const MENU_METAS: IMenu = {
    title: 'Metas',
    icon: 'material-icons',
    iconName: 'flag',
    visible: false,
    opciones: [
      {
        pantallaId: 0,
        title: 'Reportes',
        icon: 'material-icons',
        iconName: 'description',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 510,
            title: 'Metas de Oncológicos',
            icon: 'material-icons',
            iconName: 'article',
            path: '/metas/reportes/metas-oncologicos',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
    ]
  }

  function deshabilitarMenusItems(menu: IMenuItem) {
    menu.visible = false;
    menu.subMenu.forEach((subMenu) => {
      deshabilitarMenusItems(subMenu);
    });
  }

  function obtenerPantallaId(ruta: string, item: IMenuItem): number {
    let itemTieneRuta = item.path == ruta;
    if (itemTieneRuta) {
      return item.pantallaId;
    }

    let pantallaId = 0;
    item.subMenu.forEach((subItem) => {
      if (pantallaId == 0) {
        pantallaId = obtenerPantallaId(ruta, subItem);
      }
    });

    return pantallaId;
  }

  export function deshabilitarMenus() {
    let menus = obtenerMenus();
    menus.forEach((menu) => {
      menu.visible = false;
      menu.opciones.forEach((opcion) => deshabilitarMenusItems(opcion));
    });
  }

  export function obtenerMenus(): Array<IMenu> {
    return [
      MENU_PRODUCTOS,
      MENU_REEMBOLSOS,
      MENU_ECOMMERCE,
      MENU_INVENTARIO_IMPULSOS,
      MENU_MERCADEO,
      MENU_PLANIEMTRIAS,
      MENU_PRODUCTOS_ENTRENAMIENTO,
      MENU_CONFIGURACIONES_FARMACIA,
      MENU_CREDITOS,
      MENU_MAESTROS_FARMACIA,
      MENU_ANALISIS_CLINICO,
      MENU_SAD,
      MENU_INVENTARIO_REMOTOS,
      MENU_METAS,
    ];
  }

  export function obtenerPantallaIdPorRuta(ruta: string): number {
    let menus = obtenerMenus();
    let pantallaId = 0;
    menus.forEach((menu) => {
      if (pantallaId != 0) {
        return;
      }

      menu.opciones.forEach((item) => {
        if (pantallaId != 0) {
          return;
        }
        pantallaId = obtenerPantallaId(ruta, item);
      });
    });

    return pantallaId;
  }

  const MENU_CREDITOS: IMenu = {
    title: 'Créditos',
    icon: 'material-icons',
    iconName: 'money',
    visible: false,
    opciones: [
      {
        pantallaId: 0,
        title: 'Comunicados',
        icon: 'material-icons',
        iconName: 'list_alt',
        path: '',
        visible: false,
        subMenu: [
          {
            pantallaId: 292,
            title: 'Agregar Comunicado',
            icon: 'material-icons',
            iconName: 'add_to_queue',
            path: '/creditos/comunicados/agregarComunicado',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },

          {
            pantallaId: 293,
            title: 'Eliminar Comunicado',
            icon: 'material-icons',
            iconName: 'delete_sweep',
            path: '/creditos/comunicados/editarComunicado',
            visible: false,
            subMenu: new Array<IMenuItem>(),
          },
        ],
      },
    ],
  };
}
