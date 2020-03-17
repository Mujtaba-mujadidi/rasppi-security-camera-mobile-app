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

  firebaseAuthor: any


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
        resolve()
      }).catch(err => reject(err))
    })
  }

  /**
   * 
   */
  public logout(): Promise<any> {
    return this.fireAuthor.auth.signOut()
  }

  public resetPassword(email): Promise<any> {
    return this.fireAuthor.auth.sendPasswordResetEmail(email)
  }


  /**
  * @description To retrieve an observable list for the given node reference which matches the value.
  * @param nodeReference Name of the node in firebase.
  * @return Observable list retrieved from the node in firebase.
  */
  public getObservablesByMatch(nodeReference, orderByChildValue, value?): Observable<any> {
    value = (value) ? value : this.firebaseAuthor.currentUser.uid
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
