import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    constructor() { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const currentAuth: any = JSON.parse(localStorage.getItem('token'));
        if ( currentAuth !== null && currentAuth !== undefined && currentAuth.token !== null) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentAuth.token}`
                }
            });
        }
        else{
            request = request.clone();
        }

        return next.handle(request);
    }
}
