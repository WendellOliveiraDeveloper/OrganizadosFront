import { Component } from '@angular/core';
import { Modal } from '../../components/modal/modal';
import { NavbarComponent } from "../../components/navbar-component/navbar-component";

@Component({
  selector: 'app-pagina-principal',
  imports: [Modal, NavbarComponent],
  templateUrl: './pagina-principal.html',
  styleUrl: './pagina-principal.css',
})
export class PaginaPrincipal {

}
