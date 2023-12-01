import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(provideFirebaseApp(() => initializeApp({
        "projectId": "minimarket-marina-auth",
        "appId": "1:439943302427:web:3805da51f05936af5357be",
        "storageBucket": "minimarket-marina-auth.appspot.com",
        "apiKey": "AIzaSyBwjD0UDEYM6GVdGaFXiDD9GEwOjby4UQU",
        "authDomain": "minimarket-marina-auth.firebaseapp.com",
        "messagingSenderId": "439943302427"
    }))),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(AngularFireModule.initializeApp(environment.firebase)),
    importProvidersFrom(HttpClientModule),
    provideAnimations(),
    provideToastr(),
    DatePipe
  ]
};
