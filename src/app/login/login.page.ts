import { Component, OnInit } from '@angular/core';
import { FirebaseProviderService } from '../firebase-provider.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FcmService } from '../fcm.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private items: Observable<any[]>;
  private email = "raspi.prj@gmail.com"
  private password = "123456"

  profileUrl: Observable<string | null>;

  constructor(private router: Router, private alertController: AlertController, private firebaseProvider: FirebaseProviderService, private fcmService: FcmService) { }

  ngOnInit() {
    this.fcmService.listenForNotification()
  }

  login() {
    this.firebaseProvider.login(this.email, this.password).then(() => {
      console.log("Login success")
      this.fcmService.getToken()
      //Navigate to home page
      this.router.navigateByUrl('home')
    }).catch(err => alert(err.message))
  }

  async resetPassword() {
    console.log("Reset password method called")
    this.firebaseProvider.resetPassword(this.email).then(() => {
      this.alertController.create({
        header: 'Password Reset Request',
        subHeader: 'Success',
        message: "Email reset request sent to: " + this.email,
        buttons: ['OK']
      }).then(alert => alert.present())
    }).catch(err => {

      this.alertController.create({
        header: err.message,

        subHeader: "Please input a valid email!",
        inputs: [
          {
            name: 'emailAddress',
            placeholder: 'Email Address'
          }
        ],

        buttons: [
          {
            text: 'Reset Password',
            handler: data => {
              this.email = data.emailAddress
              this.resetPassword()
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          }
        ]
      }).then(alert => alert.present());


    })

  }

  test(){
    this.firebaseProvider.getVideos()
  }
}
