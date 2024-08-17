import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Solo ejecutar la lógica si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const loggedUser = localStorage.getItem('loggedUser');

      // Si el usuario ya está autenticado
      if (loggedUser) {
        // Si la ruta solicitada es /login redirigir al /parking
        if (state.url === '/login') {
          this.router.navigate(['/parking']);
          return false; // Impide el acceso al login
        }
        return true; // Permitir acceso a otras rutas
      }

      // Si no hay un usuario autenticado y se intenta acceder a /login, permitirlo
      if (state.url === '/login') {
        return true;
      }

      // Para cualquier otra ruta, redirigir al /login
      this.router.navigate(['/login']);
      return false;
    }

    // Si no estamos en el navegador, denegar la navegación a rutas protegidas
    // asumiendo que no hay un estado de sesión en el servidor
    if (state.url !== '/login') {
      this.router.navigate(['/login']);
      return false;
    }

    return true; // Permitir el acceso a la ruta de login en el servidor
  }
}
