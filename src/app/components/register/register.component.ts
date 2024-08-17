import { Component } from '@angular/core';
import swal from "sweetalert";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  signUpObj: SignUpModel  = new SignUpModel();

  onRegister() {
    debugger;
    const localUser = localStorage.getItem('angular17users');
    if(localUser != null) {
      const users =  JSON.parse(localUser);
      users.push(this.signUpObj);
      localStorage.setItem('angular17users', JSON.stringify(users))
    } else {
      const users = [];
      users.push(this.signUpObj);
      localStorage.setItem('angular17users', JSON.stringify(users))
    }
    swal("Genial!", "Te has registrado exitosamente", "success");
  }

}

export class SignUpModel  {
  name: string;
  email: string;
  password: string;

  constructor() {
    this.email = "";
    this.name = "";
    this.password= ""
  }
}
