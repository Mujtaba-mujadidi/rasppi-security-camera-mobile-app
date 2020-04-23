import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { FirebaseProviderService } from './firebase-provider.service';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(private fcm: FCM, 
    private firebaseProvider: FirebaseProviderService) {}

  /**
   * @description To generate the push notification token for the device.
   * @returns Promise indicating if the execution was successful or not.
   */
  async getToken(): Promise<any> {

    return new Promise((resolve, reject) => {
      this.fcm.getToken().then(token => {
        this.saveDeviceTokenToFirebase(token).then(() => {
          resolve()
        }).catch(err => { console.log(err), reject(err) })
      }).catch(err => { console.log(err), alert(err), reject(err) })

    })
  }

  /**
   * @description To store the device token in firebase.
   * @param token : Device token for push notification
   */
  private saveDeviceTokenToFirebase(token): Promise<any> {
    return this.firebaseProvider.pushDeviceTokenToFirebase(token)
  }

  /**
   * @description To listen for push notification.
   */
  public listenForNotification() {
    // Watch for incoming notifications and returns an object with data from the notification 
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
