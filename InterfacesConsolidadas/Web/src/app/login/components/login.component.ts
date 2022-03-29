import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Alertas } from '../../helpers/notificaciones/notificaciones';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'login-cmp',
  templateUrl: './login.component.html',
  styles: [`
        .error{
            color: red;
            display:block;
            text-align:center;
            padding-top:10px;
        }
        .message-container{

        }
    `]
})

export class LoginComponent implements OnInit {
  test: Date = new Date();
  returnUrl: string;
  loginFrm = {
    usuario: "",
    clave: ""
  }

  credencialesIncorrectas = false;

  constructor(private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router) {
    this.returnUrl = route.snapshot.queryParams['returnUrl'] || '/';
  }

  checkFullPageBackgroundImage() {
    var $page = $('.full-page');
    var image_src = $page.data('image');

    if (image_src !== undefined) {
      var image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
      $page.append(image_container);
    }
  }

  ngOnInit() {
    this.checkFullPageBackgroundImage();

    setTimeout(function () {
      // after 1000 ms we add the class animated to the login/register card
      $('.card').removeClass('card-hidden');
    }, 700)
  };
  acceder() {
    this.credencialesIncorrectas = false;
    Alertas.load("Comprobando usuario");
    this.loginService.acceder(this.loginFrm.usuario, this.loginFrm.clave).then(data => {
      this.credencialesIncorrectas = false;

      //this.loginService.CargarPermisos().then(() => {
         this.router.navigate([this.returnUrl]);
         Alertas.close();
      // });


    }).catch(err => {
      this.credencialesIncorrectas = true;
      Alertas.showHttpResponse(err);
      console.log(err);
    });
  }
}
