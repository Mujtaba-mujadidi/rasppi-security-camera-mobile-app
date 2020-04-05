import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import 'firebase/storage';
import * as firebase from 'firebase/app';





@Injectable({
  providedIn: 'root'
})
export class FirebaseProviderService {

  private currentUser

  private email
  private password


  constructor(public firebaseDatabase: AngularFireDatabase, public fireAuthor: AngularFireAuth, public storage: AngularFireStorage) {
  }


  async getVideos() {
    let cloudFiles = []
    const nodeRef = this.fireAuthor.auth.currentUser.uid
    const storageRef = firebase.storage().ref(nodeRef + "");
    await storageRef.listAll().then(async result => {
      result.items.forEach(async (ref) => {
        const videoDetails = {
          "url": await ref.getDownloadURL(),
          "name": ref.name
        };
        cloudFiles.push(videoDetails);
      });
    })
    return cloudFiles

  }

  /**
   * 
   * @param email 
   * @param password 
   */
  public login(email, password): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fireAuthor.auth.signInWithEmailAndPassword(email, password).then((user) => {
        this.email = email
        this.password = password
        this.currentUser = this.fireAuthor.auth.currentUser
        resolve()
      }).catch(err => reject(err))
    })
  }

  /**
   * 
   */
  public logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fireAuthor.auth.signOut().then(() => {
        this.currentUser = null
        resolve();
      }).catch(err => {
        reject(err)
      })
    })
  }

  public resetPassword(email): Promise<any> {
    return this.fireAuthor.auth.sendPasswordResetEmail(email)
  }

  public updatePassword(email, password, newPassword):Promise<any> {
    return new Promise((resolve, reject) => {

      this.reauthenticateUser(email, password).then(()=>{
        this.fireAuthor.auth.currentUser.updatePassword(newPassword).then(()=>{
          resolve("Password updated successfully")
        }).catch(err=>reject(err))
      }).catch(err=>reject(err))
    })
  }

  public updateEmail(email, password, newEmail): Promise<any> {
    return new Promise((resolve, reject) => {
      this.reauthenticateUser(email, password).then(() => {
        this.fireAuthor.auth.currentUser.updateEmail(newEmail).then(() => {
          resolve("Email updated successfully")
        }).catch(err=>reject(err))
      }).catch(err=>reject(err))
    })
  }

  public updateEmailAndPassword(email, password, newEmail, newPassword): Promise<any> {
    return new Promise((resolve, reject) => {
      this.updatePassword(email, password, newPassword).then(()=>{
        this.updateEmail(email, newPassword, newEmail).then(()=>{
          resolve("Email and Password updated successfully")
        })
      })
    
    })
  }


  private reauthenticateUser(email, password): Promise<any>{
    const credentials = firebase.auth.EmailAuthProvider.credential(email, password)
    return  this.fireAuthor.auth.currentUser.reauthenticateWithCredential(credentials)
  }


  /**
  * @description To retrieve an observable list for the given node reference which matches the value.
  * @param nodeReference Name of the node in firebase.
  * @return Observable list retrieved from the node in firebase.
  */
  public getObservablesByMatch(nodeReference, orderByChildValue, value?): Observable<any> {
    value = (value) ? value : this.fireAuthor.auth.currentUser.uid
    return this.firebaseDatabase.list(nodeReference, ref => ref.orderByChild(orderByChildValue).equalTo(value)).snapshotChanges();
  }

  /**
   * 
   */
  public getObservableList() {
    const nodeRef = this.fireAuthor.auth.currentUser.uid
    return this.firebaseDatabase.list(nodeRef + "").valueChanges();
  }

}
