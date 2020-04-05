import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor() { 

  }

  async getToken(){
    let token

    console.log("Method called to generate token")

    // this.firebaseNative.getToken().then(token=>{
    //   console.log("Token: " + token)
    //   alert (token)
    // }).catch(e => {alert(e), console.log(e)})

    // if (this.platform.is('android')){
      
    //   token = await this.firebaseNative.getToken()
 
    // }

    // if (this.platform.is('ios')){
    //   token = await this.firebaseNative.getToken()
    //   await this.firebaseNative.grantPermission()
    // }

    this.saveDeviceTokenToFirebase(token);
  }


  private saveDeviceTokenToFirebase(token){
    if (!token){return}

    console.log(token)
    alert (token);

  }


}
