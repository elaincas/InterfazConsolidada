export interface IUsuario {
  id: number;
  token: string;
  usuario: string;
}

export class Usuario {
  id: number;
  token: string;
  usuario: string;

  constructor(datos?: IUsuario) {
    if (datos != null) {
      this.token = datos.token;
      this.usuario = datos.usuario;
      this.id = datos.id;
      return;
    }
    this.token = "";
    this.usuario = "";
    this.id = 0;
  }
}

export class Credenciales {
  usuario: string;
  clave: string;
  aplicacionId: number;
  constructor(usuario: string, clave: string, aplicacionId: number) {
    this.usuario = usuario;
    this.clave = clave;
    this.aplicacionId = aplicacionId;
  }
}
