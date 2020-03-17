import { Component, OnInit } from '@angular/core';
import { FirebaseProviderService } from '../firebase-provider.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  private homeSegment = "videos"

  private videosData = []
  private ListOfLogs : Observable<any | null>;

  constructor(public firebaseProvider: FirebaseProviderService,) { 
  }


  ngOnInit() {
    this.getVideos()
    this.getLogs()
    //console.log("Entered home page")
   // console.log(this.firebaseProvider.getVideos())
  }

  getVideos(){
    this.firebaseProvider.getVideos().then(data=>{
    
      this.videosData = data

    });
  }

  private getLogs(){
   this.ListOfLogs = this.firebaseProvider.getObservableList()
   this.firebaseProvider.getObservableList().forEach(e=>{
     console.log(e)
   })
  }

  

 

}
