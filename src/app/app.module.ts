import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


// Firebase module imports
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';


//FCM
import { FCM } from '@ionic-native/fcm/ngx';


const FIRE_CONFIG = {
  apiKey: "AIzaSyCviGU6TFW6cwMoZN15L_pFmZEwPzLwfNk",
  authDomain: "raspberry-pi-security-camera.firebaseapp.com",
  databaseURL: "https://raspberry-pi-security-camera.firebaseio.com",
  projectId: "raspberry-pi-security-camera",
  storageBucket: "raspberry-pi-security-camera.appspot.com",
  messagingSenderId: "20264300276",
  appId: "1:20264300276:web:76054dc8a2882ba8cef8a1"
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(FIRE_CONFIG),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FCM,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AngularFireAuth,
    AngularFireDatabase

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
