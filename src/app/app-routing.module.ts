import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './common/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./@Paginas/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'acercaRCSS',
    loadChildren: () => import('./@Paginas/acerca-rcss/acerca-rcss.module').then(m => m.AcercaRcssModule)
  },
  {
    path: 'acercaSIAR',
    loadChildren: () => import('./@Paginas/acerca-siar/acerca-siar.module').then(m => m.AcercaSiarModule)
  },
  {
    path: 'noticias',
    loadChildren: () => import('./@Paginas/noticias/noticias.module').then(m => m.NoticiasModule)
  },
  {
    path: 'gestionNoticias',
    loadChildren: () => import('./@Paginas/noticias/noticias.module').then(m => m.NoticiasModule)
  },
  {
    path: 'boletines',
    loadChildren: () => import('./@Paginas/boletines/boletines.module').then(m => m.BoletinesModule)
  },
  {
    path: 'eventos',
    loadChildren: () => import('./@Paginas/eventos/eventos.module').then(m => m.EventosModule)
  },
  {
    path: 'gestionEventos',
    loadChildren: () => import('./@Paginas/eventos/eventos.module').then(m => m.EventosModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'alertas',
    loadChildren: () => import('./@Paginas/alertas/alertas.module').then(m => m.AlertasModule)
  },
  {
    path: 'calendario',
    loadChildren: () => import('./@Paginas/calendario/calendario.module').then(m => m.CalendarioModule)
  },
  {
    path: 'adminUsuario',
    loadChildren: () => import('./@Paginas/admin-usuarios/admin-usuarios.module').then(m => m.AdminUsuariosModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'miembros',
    loadChildren: () => import('./@Paginas/miembros/miembros.module').then(m => m.MiembrosModule)
  },
  {
    path: 'registroUsuario',
    loadChildren: () => import('./@Paginas/registro-usuario/registro-usuario.module').then(m => m.RegistroUsuarioModule)
  },
  {
    path: 'cursosTalleres/seccion/1',
    loadChildren: () => import('./@Paginas/cursos-talleres/cursos-talleres.module').then(m => m.CursosTalleresModule)
  },
  {
    path: 'cursosTalleres',
    loadChildren: () => import('./@Paginas/cursos-talleres/cursos-talleres.module').then(m => m.CursosTalleresModule)
    , canActivate: [AuthGuard]
  }
  ,
  {
    path: 'homePais',
    loadChildren: () => import('./@Paginas/home-pais/home-pais.module').then(m => m.HomePaisModule)
  },
  {
    path: 'autoridades',
    loadChildren: () => import('./@Paginas/autoridades/autoridades.module').then(m => m.AutoridadesModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'gestionProveedores',
    loadChildren: () => import('./@Paginas/gestion-proveedores/gestion-proveedores.module').then(m => m.GestionProveedoresModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'consultarProveedores',
    loadChildren: () => import('./@Paginas/consulta-proveedores/consulta-proveedores.module').then(m => m.ConsultaProveedoresModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'documentos',
    loadChildren: () => import('./@Paginas/documentos/documentos.module').then(m => m.DocumentosModule)
  },
  {
    path: 'editarPerfil',
    loadChildren: () => import('./@Paginas/editar-perfil/editar-perfil.module').then(m => m.EditarPerfilModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./@Paginas/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'gestionAlertas',
    loadChildren: () => import('./@Paginas/gestion-alertas/gestion-alertas.module').then(m => m.GestionAlertaModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'gestionDocPrivados',
    loadChildren: () => import('./@Paginas/gest-doc/gest-doc-privados.module').then(m => m.GestDocPrivadoModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'documentosPrivados',
    loadChildren: () => import('./@Paginas/gest-doc/gest-doc-privados.module').then(m => m.GestDocPrivadoModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'gestionBoletines',
    loadChildren: () => import('./@Paginas/gestion-boletin/gestion-boletin.module').then(m => m.GestionBoletinModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'sincronizacionAlertas',
    loadChildren: () => import('./@Paginas/sincronizacion-alertas/sincronizacion-alertas.module').then(m => m.SincronizacionAlertasModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'gestionDocumentos',
    loadChildren: () => import('./@Paginas/gestion-doc-publi/gestion-doc-publi.module').then(m => m.GestionDocPubliModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'reporteDinamico',
    loadChildren: () => import('./@Paginas/reporte-dinamico/reporte-dinamico.module').then(m => m.ReporteDinamicoModule)
  },
  {
    path: 'ingresarAlertas',
    loadChildren: () => import('./@Paginas/ingres-alerta/ingresar-alertas.module').then(m => m.AdminAlertasModule), canActivate: [AuthGuard]
  },
  {
    path: 'resultadosPalabraClave',
    loadChildren: () =>
      import('./@Paginas/resultados-palabra-clave/resultados-palabra-clave.module').then(m => m.ResultadosPalabraClaveModule)
  },
  {
    path: 'codigoLesiones',
    loadChildren: () =>
      import('./@Paginas/codigo-lesiones/codigo-lesiones.module').then(m => m.CodigoLesionesModule)
  },
    {
    path: 'gestionDirectorios',
    loadChildren: () => import('./@Paginas/gestion-directorios/gestion-directorios.module').then(m => m.GestionDirectoriosModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'consultarDirectorios',
    loadChildren: () => import('./@Paginas/gestion-directorios/gestion-directorios.module').then(m => m.GestionDirectoriosModule),
  },
  {
    path: 'gestionAtlas',
    loadChildren: () => import('./@Paginas/gestion-atlas/gestion-atlas.module').then(m => m.GestionAtlasModule)
  },
  {
    path: 'consultarAtlas',
    loadChildren: () => import('./@Paginas/gestion-atlas/gestion-atlas.module').then(m => m.GestionAtlasModule)
  },
  {
    path: 'ingresarPlantillaAtlas',
    loadChildren: () => import('./@Paginas/plantillas-atlas/plantillas-atlas.module').then(m => m.PlantillasAtlasModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
