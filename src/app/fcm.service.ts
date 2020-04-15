import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { FirebaseProviderService } from './firebase-provider.service';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(private fcm: FCM, private firebaseProvider: FirebaseProviderService) {

  }

  async getToken(): Promise<any> {

    return new Promise((resolve, reject) => {
      this.fcm.getToken().then(token => {
        this.saveDeviceTokenToFirebase(token).then(() => {
          resolve()
        }).catch(err=> {console.log(err), reject(err)})
      }).catch(err => { console.log(err), alert(err), reject(err) })

    })
  }



  private saveDeviceTokenToFirebase(token): Promise<any> {
    return this.firebaseProvider.pushDeviceTokenToFirebase(token)

  }

  listenForNotification() {
    // ionic push notification example
    this.fcm.onNotification().subscribe(data => {
      console.log(data);
      if (data.wasTapped) {
        console.log('Received in background');
        alert(data["body"])
      } else {
        console.log('Received in foreground');
        alert(data["body"])
      }
    });
  }


}
