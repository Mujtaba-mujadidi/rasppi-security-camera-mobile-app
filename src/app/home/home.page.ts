import { Component, OnInit, ElementRef } from '@angular/core';
import { FirebaseProviderService } from '../firebase-provider.service';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  private homeSegment = "videos"

  private videosData = []
  private ListOfLogs: Observable<any | null>;

  private email = ""
  private password = ""
  private updateEmail = false
  private newEmail = ""
  private newPassword = ""
  private updatePassword = false

  constructor(public firebaseProvider: FirebaseProviderService, private alertController: AlertController) {
  }


  ngOnInit() {
    this.getVideos()
    this.getLogs()
    //console.log("Entered home page")
    // console.log(this.firebaseProvider.getVideos())
  }

  getVideos() {
    this.firebaseProvider.getVideos().then(data => {

      this.videosData = data

    });
  }

  private getLogs() {
    this.ListOfLogs = this.firebaseProvider.getObservableList()
    this.firebaseProvider.getObservableList().forEach(e => {
      console.log(e)
    })
  }

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
