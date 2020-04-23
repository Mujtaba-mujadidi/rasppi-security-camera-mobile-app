import { Component, OnInit, ElementRef } from '@angular/core';
import { FirebaseProviderService } from '../firebase-provider.service';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  private homeSegment = "videos"

  //list videos url from the Firebase Storage
  private videosData = [] 
  //list logs from the Firebase Real Time Database
  private ListOfLogs: Observable<any | null>;

  //Email and password used to login.
  private email = ""
  private password = ""
  //To indicate if email or password update is requested.
  private updateEmail = false
  private updatePassword = false
  //New email and password
  private newEmail = ""
  private newPassword = ""
  

  constructor(private router: Router,
     public firebaseProvider: FirebaseProviderService, 
     private alertController: AlertController) {}

  ngOnInit() {
    this.getVideos()
    this.getLogs()
  }

  /**
   * @description To retrieve list of video urls from Firebase Storage
   */
  private getVideos() {
    this.firebaseProvider.getVideos().then(data => {
      this.videosData = data
    });
  }

  /**
   * @description To retrieve list of logs from Firebase Realtime Database.
   */
  private getLogs() {
    this.ListOfLogs = this.firebaseProvider.getObservableList()
  }

  /**
   * @description To logout from Firebase and navigate back to the login page.
   */
  private logout(){
    this.firebaseProvider.logout().then(()=>{
      alert("Logout successful")
      this.router.navigateByUrl('login')
    }).catch(err => alert(err))
    
  }

  /**
   * @description Based on user selection, updates email, password, or both.
   */
  private updateLoginDetails() {
    if(this.updateEmail && this.updatePassword){
      this.firebaseProvider.updateEmailAndPassword(this.email, this.password, this.newEmail, this.newPassword).then((res)=>{
        alert(res)
      }).catch(err => alert(err))
    }else if(this.updateEmail){
      this.firebaseProvider.updateEmail(this.email, this.password, this.newEmail).then((res)=>{
        alert(res)
      }).catch(err => alert(err))
    }else{
      this.firebaseProvider.updatePassword(this.email, this.password, this.newPassword).then((res)=>{
        alert(res)
      }).catch(err => alert(err))
    }
  }
}
