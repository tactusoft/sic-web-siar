export class Constants {

  public static URL_OAS_EN = 'https://www.oas.org/ext/Portals/34/EN/OASAGRES_en.zip';
  public static URL_OAS_ES = 'https://www.oas.org/ext/Portals/34/ES/OASAGRES_es.zip';
  public static URL_OAS_FR = 'https://www.oas.org/ext/Portals/34/FR/OASAGRES_fr.zip';
  public static URL_OAS_PT = 'https://www.oas.org/ext/Portals/34/PT/OASAGRES_pt.zip';
  public static URL_FORMATO_EN = 'https://www.oas.org/ext/Portals/34/EN/Form_Notif_AutRepRCSS.pdf';
  public static URL_FORMATO_ES = 'https://www.oas.org/ext/Portals/34/ES/Form_Notif_AutRepRCSS_SPA.PDF';
  public static URL_FORMATO_FR = 'https://www.oas.org/ext/Portals/34/EN/Form_Notif_AutRepRCSS.pdf';
  public static URL_FORMATO_PT = 'https://www.oas.org/ext/Portals/34/ES/Form_Notif_AutRepRCSS_SPA.PDF';
  public static AG_RES_EN = 'https://www.oas.org/ext/Portals/34/EN/RCSS_AG2014_ENG.pdf';
  public static AG_RES_ES = 'https://www.oas.org/ext/Portals/34/ES/RCSS_AG2014_ESP.pdf';
  public static AG_RES_FR = 'https://www.oas.org/ext/Portals/34/FR/RCSS_AG2014_FRA.pdf';
  public static AG_RES_PT = 'https://www.oas.org/ext/Portals/34/PT/RCSS_AG2014_POR.pdf';
  public static LOGO_SIAR_ES = 'siar_es.png';
  public static LOGO_SIAR_HOVER_ES = 'siar_es_hover.png';
  public static LOGO_SIAR_EN = 'siar_en.png';
  public static LOGO_SIAR_HOVER_EN = 'siar_en_hover.png';
  public static TWITTER = 'http://twitter.com/share?url=';
  public static FACEBOOK = 'https://www.facebook.com/sharer.php?u=';
  public static PATTERN_EMAIL = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public static PATTERN_WHITE_SPACE = /.*[^ ].*/;
  public static PATTERN_NUMBER = /^-?(0|[1-9]\d*)?$/;
  public static KEY_CAPTCHA = '6LfVxd8ZAAAAALrGUIor5me9v5tmQ0VZRqOnROji';

  public static MENSAJE_RECUPERACION_CONTRASENA_OK = 'Recuerde que se le enviará al correo su nueva contraseña';
  public static MENSAJE_CAPTCHA_FALLO = 'reCAPTCHA ha expirado, por favor recargue la página';
  public static RECUERDA_CAMBIO_CONTRASENA = '<a href="replaceURL/editarPerfil" style="text-decoration: underline">MENSAJE</a>';
  public static MSJ_RECUERDA_CAMBIO_CONTRASENA = 'Para continuar es necesario que cambie su contraseña aquí';
  public static MSJ_MAXIMO_ARCHIVOS = 'Número máximo de archivos alcanzado';
  public static MSJ_PESO_MAXIMO = 'Peso máximo de archivo sobrepasado';
  public static MSJ_OPE_REALIZADA = 'La operación se realizó con éxito';
  public static TAMANO_SUPERADO = 'El tamaño del archivo es mayor a 5MB ';
  public static FORMATO_IMAGEN_INVALIDO = 'El formato de la imagen  es invalido, formatos validos (JPEG,JPG,PNG,GIF) ';
  public static FORMATO_VIDEOS_INVALIDO = 'El formato de video invalido, formatos validos (MP4, MKV, AVI, DVD, WMV, MOV) ';
  public static FORMATO_DOCUMENTOS_INVALIDO = 'El formato de documento invalido, formatos validos (DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, PNG, RTF, JPEG, JPG, PNG, GIF) ';
  public static NUMERO_MAXIMO_ARCHIVO_5 = 'Se permite máximo 5 archivos';
  public static NUMERO_MAXIMO_ARCHIVO_10 = 'Se permite máximo 10 archivos';
  public static FILTRO_NO_SOPORTADO = 'Busqueda para la columna indicada no soportada';
  public static MENSAJE_ERROR = 'Se ha producido un error al intentar establecer comunicación con el servidor';
  public static MENSAJE_CAMPOS_FALTANTES = 'Se deben diligenciar los campos obligatorios';
  public static MENSAJE_NO_DATA = 'No se encontraron registros';
  public static TIPO_CURSO_TALLER = 'Tipo Curso / Taller';
  public static CURSO_ELIMINADO = ' Curso/Taller Eliminado Exitosamente ';
  public static ERROR_ELIMINAR_CURSO = ' Falla al eliminar Curso/Taller ';
  public static BUSQUEDA_MINIMO_CARACTERES = 'Debe ingresar mínimo 4 caracteres para iniciar la búsqueda';
  public static BUSQUEDA_SIN_RESULTADOS = 'La búsqueda no arrojó resultados.';
  public static MENSAJE_TX_OK = 'Se ha realizado la operación correctamente';
  public static MENSAJE_ELIMINADO_OK = 'Se ha realizado la operación correctamente';

  public static MESES = [
    {
      id: 1,
      mes: 'Enero'
    },
    {
      id: 2,
      mes: 'Febrero'
    },
    {
      id: 3,
      mes: 'Marzo'
    },
    {
      id: 4,
      mes: 'Abril'
    },
    {
      id: 5,
      mes: 'Mayo'
    },
    {
      id: 6,
      mes: 'Junio'
    },
    {
      id: 7,
      mes: 'Julio'
    },
    {
      id: 8,
      mes: 'Agosto'
    },
    {
      id: 9,
      mes: 'Septiembre'
    },
    {
      id: 10,
      mes: 'Octubre'
    },
    {
      id: 11,
      mes: 'Noviembre'
    },
    {
      id: 12,
      mes: 'Diciembre'
    }
  ];

  // Path Imagenes Background
  public static PATH_IMG_REUNION = 'assets/img/reunion.jpg';
  public static PATH_IMG_BANNER_HOME = 'assets/img/banner-home.jpg';
  public static PATH_IMG_EVENTOS_AUDITORIO = 'assets/img/eventos-auditorio.jpg';
  public static PATH_IMG_MANOS_SIAR = 'assets/img/manos-siar.jpg';
  public static PATH_IMG_TWITTER = 'assets/img/twitter.png';
  public static PATH_IMG_FACEBOOK = 'assets/img/facebook.png';
  public static PATH_IMG_LINK = 'assets/img/enlace.png';
  public static PATH_IMG_BANNER_REGISTRO = 'assets/img/banner-registro.jpg';
  public static PATH_IMG_BANDERAS = 'assets/img/banderas.jpg';
  public static PATH_IMG_BANNER_SUSCRIPCION = 'assets/img/banner-suscripcion.jpg';
  public static PATH_IMG_BANNER_LOGIN = 'assets/img/banner-login.jpg';
  public static PATH_IMG_MANOS_ROMPECABEZA = 'assets/img/manos-rompecabeza.jpg';
  public static PATH_IMG_SIAR_ES = 'assets/img/siar_es.png';
  public static PATH_IMG_SIAR_ES_HOVER = 'assets/img/siar_es_hover.png';
  /*public static PATH_IMG_BANNER_HOME = 'assets/img/AQUI.jpg';*/

  // Constante con la ruta del servicio que se encarga del controlador pais
  public static PATH_ALERTA = '/alerta';

  // Constante para la url listar principal
  public static PATH_LISTAR_PRINCIPAL_ALERTA = `${Constants.PATH_ALERTA}/listarAlertasFiltro`;
  // Constante para la url listar por producto
  public static PATH_LISTAR_POR_PRODUCTO = `${Constants.PATH_ALERTA}/listarAlertasNomProd`;
  // Constante para la url listar por codigo
  public static PATH_LISTAR_POR_CODIGO = `${Constants.PATH_ALERTA}/listarAlertasCod`;
  // Constante para la url eliminar alerta
  public static PATH_ELIMINAR_ALERTA = `${Constants.PATH_ALERTA}/eliminarAlerta`;

  // Constante con la ruta del servicio que se encarga del controlador pais
  public static PATH_DOMINIO = '/dominio';

  // Constante para la url listar paises basico
  public static PATH_LISTAR_DOMINIO_NOMBRE = `${Constants.PATH_DOMINIO}/listarDominioPorNombre`;
  // Constante para la url listar paises basico
  public static PATH_LISTAR_DOMINIO_NOMBRE_LANG = `${Constants.PATH_DOMINIO}/listarDominioPorNombreLang`;

  public static PATH_LISTAR_SUBDOMINIOS_LANG = `${Constants.PATH_DOMINIO}/listarSubdominiosLang`;

  // Constante para la url listar dominios basico en Español
  public static PATH_LISTAR_DOMINIO_NOMBRE_ESP = `${Constants.PATH_DOMINIO}/listarDominioPorNombreEsp`;

  // Constante con la ruta del servicio que se encarga del controlador pais
  public static PATH_DOCUMENTO = '/documento';

  // Constante para la url listar paises basico
  public static PATH_GUARDAR_DOCUMENTO = `${Constants.PATH_DOCUMENTO}/guardarDocumento`;
  public static PATH_ELIMINAR_DOCUMENTO = `${Constants.PATH_DOCUMENTO}/eliminarDocumento`;

  // Constante con la ruta del servicio que se encarga del controlador pais
  public static PATH_PAIS = '/pais';

  // Constante para la url listar paises basico
  public static PATH_LISTAR_PAIS_BASIC = `${Constants.PATH_PAIS}/listarPaisesBasic`;
  public static PATH_LISTAR_PAIS_LANG = `${Constants.PATH_PAIS}/listarPaises`;

  // Constante para la Url de listar idiomas
  public static PATH_LISTAR_IDIOMAS = `/idioma/listarIdioma?page=0&size=100`;

  // Constante con la ruta del servicio que se encarga de autenticar al usuario
  public static PATH_USUARIO = '/usuario';

  // Constante para la url de dominios
  public static PATH_LOGIN = `${Constants.PATH_USUARIO}/validarLogin`;

  // Constante para la url de consulta usuario por email -  Se le concatena el email
  public static PATH_GET_DETALLE_USR_EMAIL = `${Constants.PATH_USUARIO}/detalleUsuarioEmail?email=`;

  // Constante url para obtener usuario por token
  public static PATH_USUARIO_TOKEN = `${Constants.PATH_USUARIO}/obtenerUsuarioToken`;

  // Constante url para obtener menu del usuario por token
  public static PATH_MENU_TOKEN = `/menu/consultaMenuPorToken`;

  // Constante para la url de consulta de sincronizaciones - homologaciones
  public static PATH_GET_SINCRONIZACION = '/sincronizacion/consultarSincronizacion';
  public static PATH_RESINC_ALERTAS = '/sincronizacion/reSincronizarAlertas?idAlertaLog=';
  public static PATH_GET_HOMOLOGACIONES = '/homologacion/consultarHomologacion?tipo=';
  public static PATH_SAVE_HOMOLOGACION = '/homologacion/guardarHomologacion';

  // Constantes para la url de parámetros de alertas.
  public static PATH_CREATE_PARAMETROS_ALERTAS = '/gestion/parametros/alertas/crear';
  public static PATH_UPDATE_EDO_PARAMETRO_ALERTA = '/gestion/parametros/alertas/cambiar/estados';
  public static PATH_GET_PARAMETROS_ALERTAS_FILTRO = '/gestion/parametros/alertas/filtrar';
  public static PATH_EDIT_PARAMETROS_ALERTAS = '/gestion/parametros/alertas/editar';
  public static PATH_CONSULT_PARAMETROS_ALERTAS = '/gestion/parametros/alertas/consultar';

  // Constantes para la url de boletines
  public static PATH_CREAR_BOLETIN = '/boletin/crearBoletin';
  public static PATH_EDITAR_BOLETIN = '/boletin/editarBoletin';
  public static PATH_ELIMINAR_BOLETIN = '/boletin/eliminarBoletin';
  public static PATH_SUSCRIBIR_BOLETIN = '/boletin/suscribir';
  public static PATH_CANCELAR_SUSCRIBIR_BOLETIN = '/boletin/cancelar';

  // Constantes para la url de directorios
  public static PATH_GET_DIRECTORIOS = '/directorio/listar';
  public static PATH_CREAR_DIRECTORIO = '/directorio/crear';
  public static PATH_EDITAR_DIRECTORIO = '/directorio/editar';
  public static PATH_ELIMINAR_DIRECTORIO = '/directorio/eliminar';

  // Constantes para la url de atlas
  public static PATH_CREAR_PLANTILLA_ATLAS = '/atlas/guardarPlantilla';
  public static PATH_EDITAR_PLANTILLA_ATLAS = '/atlas/editarPlantilla';
  public static PATH_ELIMINAR_PLANTILLA_ATLAS = '/atlas/eliminarPlantilla';

  // Constantes para la url de documentos
  public static PATH_GUARDAR_FOLDER = '/folder/guardarFolder';

  // Constante con la ruta del servicio que se encarga del controlador pais
  public static PATH_HIST_PROVEEDOR = '/proveedor';

  // Constante para la url listar paises basico
  public static PATH_GUARDAR_HIST_PROVEEDOR = `${Constants.PATH_HIST_PROVEEDOR}/guardar`;
  public static PATH_ELIMINAR_HIST_PROVEEDOR = `${Constants.PATH_HIST_PROVEEDOR}/eliminar`;

  // Constantes de imagenes
  public static ICON_CONTRASENA = 'assets/svg/icon_contrasena.svg';
  public static ICON_USUARIO = 'assets/svg/icon_usuario.svg';
  public static ICON_PERFIL = 'assets/svg/icon_perfil_azul.svg';
  public static ICON_EDITAR = 'assets/svg/icono_editar.svg';
  public static ICON_ELIMINAR = 'assets/svg/icono_eliminar.svg';
  public static ICON_EDITAR_NEW = 'assets/svg/lapiz.svg';
  public static ICON_ELIMINAR_NEW = 'assets/svg/caneca (1).svg';
  public static ICON_CARGAR_FILE = 'assets/svg/Grupo 7182.svg';
  public static ICON_MAS = 'assets/svg/MasNuevo.svg';
  public static ICON_ETIQUETA = 'assets/svg/etiqueta.svg';
  public static ICON_CANECA = 'assets/svg/caneca.svg';
  public static ICON_APAGAR = 'assets/svg/icon_apagar.svg';
  public static ICON_CAMARA = 'assets/svg/camara.svg';
  public static ICON_CAMARA_VIDEO = 'assets/svg/videocamara.svg';
  public static ICON_BUSCADOR = 'assets/svg/buscador.svg';
  public static ICON_RCSS_LOGO = 'assets/svg/Logo_RCSS_[LG].svg';
  public static ICON_OEA_LOGO = 'assets/svg/Logo_OEA_[LG].svg';
  // Constantes Status http
  public static NO_CONTENT = 'NO_CONTENT';
  public static FORBIDDEN = 'FORBIDDEN';
  public static LOCKED = 'LOCKED';
  public static INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';

  // Patrones de validación
  public static NOMBRES_PATTERN = /^\S[a-zA-ZáéíóúÁÉÍÓÚüÜñÑàèìòùÀÈÌÒÙ ]*$/;

  // Patrón de contraseñas
  public static PASSWORD_PATTER = /^(?=.*[*#¿?!¡&$()%/+_.])(?=.*[A-Z]).{0,}(?=.*[a-zA-Z]).{8,}$/;

  // llave de encriptacion
  public static PRIVATE_KEY = 's1C-K3y';

  // Constanstes
  public static SEGUNDOS_BLOQUEO = 900;

  // Constants ID idiomas
  public static ID_IDIOMA_ESP = '1';
  public static ID_IDIOMA_ENG = '2';
  public static ID_IDIOMA_FRA = '3';
  public static ID_IDIOMA_POR = '4';

  // Constants ID roles
  public static ID_ROL_ADMIN_PPAL = 1;
  public static ID_ROL_ADMIN = 2;
  public static ID_ROL_PAIS_R = 4;
  public static ID_ROL_PAIS_W = 3;

  // valores estados (status)
  public static ESTADO_ACTIVO = 'A';
  public static ESTADO_INACTIVO = 'I';

  static tiposDocumentosValidos = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/rtf',
    'application/x-rtf',
    'text/richtext',
    'text/plain',
    'image/jpeg',
    'image/gif',
    'image/png',
    'application/pdf'
  ];
  static tiposImagenesValidas = [
    'image/jpeg',
    'image/gif',
    'image/png'
  ];
  static tiposVideosValidos = [
    'video/mp4',
    'video/x-matroska',
    'video/x-msvideo',
    'video/x-ms-wmv',
    'video/quicktime',
    'video/avi',
    'video/mpeg'
  ];

  static tipoArchivosValidos = [
    'image/png',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/rtf',
    'image/jpeg',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/pdf'
  ];
}
