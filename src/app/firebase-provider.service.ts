import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import 'firebase/storage';
import * as firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class FirebaseProviderService {

  constructor(public firebaseDatabase: AngularFireDatabase,
    public fireAuthor: AngularFireAuth) {
  }


  /**
   * @description To store device token in Firebase Realtime Database.
   * @param token Device token for push notification. 
   * @returns Promise that resolves or rejects based on function success.
   */
  public pushDeviceTokenToFirebase(token): Promise<any> {
    return this.firebaseDatabase.database.ref("devices").child(this.fireAuthor.auth.currentUser.uid).set({ "token": token })
  }

  /**
   * @description Retrieves list of video URLs from the Firebase Storage for the logged in user.
   * @returns List of URLs for the recordings of the user.
   */
  public async getVideos() {
    let videoUrls = []
    //Video recordings are stored under a node with the each user's UID.
    const storageRef = firebase.storage().ref(this.fireAuthor.auth.currentUser.uid + "");
    await storageRef.listAll().then(async result => {
      result.items.forEach(async (ref) => {
        //An object containing details of the video.
        const videoDetails = {
          "url": await ref.getDownloadURL(),
          "name": ref.name
        };
        videoUrls.push(videoDetails);
      });
    })
    return videoUrls

  }

  /**
   * @description To login to Firebase.
   * @param email Login email
   * @param password Login password
   * @returns Promise, resolve on successful authentication, reject on failed authentication. 
   */
  public login(email, password): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fireAuthor.auth.signInWithEmailAndPassword(email, password).then((user) => {
        resolve()
      }).catch(err => {reject(err)})
    })
  }

  /**
   * @@description To logout the user from Firebase.
   */
  public logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fireAuthor.auth.signOut().then(() => {
        resolve();
      }).catch(err => {reject(err)})
    })
  }

  /**
   * @description Sends a password reset link for the associated account with the supplied email.
   * @param email Email of the account for which password reset is requested.
   * @returns Promise, resolves if request is successful, rejects otherwise.  
   */ 
  public resetPassword(email): Promise<any> {
    return this.fireAuthor.auth.sendPasswordResetEmail(email)
  }

  /**
   * @description To update the logged in user's password.
   * @param email Current logged in email.
   * @param password Current logged in password.
   * @param newPassword New password.
   * @returns Promise that resolves in request is successful, rejects otherwise.
   */
  public updatePassword(email, password, newPassword): Promise<any> {
    return new Promise((resolve, reject) => {
      this.reauthenticateUser(email, password).then(() => {
        this.fireAuthor.auth.currentUser.updatePassword(newPassword).then(() => {
          resolve("Password updated successfully")
        }).catch(err => reject(err))
      }).catch(err => reject(err))
    })
  } 

  /**
   * @description To update the logged in user's email.
   * @param email Current logged in email.
   * @param password Current logged in password.
   * @param newEmail New email.
   * @returns Promise that resolves in request is successful, rejects otherwise.
   */
  public updateEmail(email, password, newEmail): Promise<any> {
    return new Promise((resolve, reject) => {
      this.reauthenticateUser(email, password).then(() => {
        this.fireAuthor.auth.currentUser.updateEmail(newEmail).then(() => {
          resolve("Email updated successfully")
        }).catch(err => reject(err))
      }).catch(err => reject(err))
    })
  }

  /**
   * @description To update the logged in user's email and password.
   * @param email Current logged in email.
   * @param password Current logged in password.
   * @param newEmail New email.
   * @param newPassword New password.
   * @returns Promise that resolves in request is successful, rejects otherwise.
   */
  public updateEmailAndPassword(email, password, newEmail, newPassword): Promise<any> {
    return new Promise((resolve, reject) => {
      this.updatePassword(email, password, newPassword).then(() => {
        this.updateEmail(email, newPassword, newEmail).then(() => {
          resolve("Email and Password updated successfully")
        })
      })

    })
  }


  /**
   * @description To reauthenticate logged in user. 
   * @param email Current logged in email.
   * @param password Current logged in password.
   * @description Promise that resolves if the email and password is valid for logged in user. 
   */
  private reauthenticateUser(email, password): Promise<any> {
    const credentials = firebase.auth.EmailAuthProvider.credential(email, password)
    return this.fireAuthor.auth.currentUser.reauthenticateWithCredential(credentials)
  }

  /**
  * @description To retrieve an observable list for the given node reference.
  * @param nodeReference Name of the node in firebase.
  * @return Observable list retrieved from the node in firebase.
   */
  public getObservableList() {
    const nodeRef = "logs/" + this.fireAuthor.auth.currentUser.uid
    return this.firebaseDatabase.list(nodeRef + "").valueChanges();
  }
}
