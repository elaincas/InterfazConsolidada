export class Mensajes {
  constructor() {}
    Error_DimensionesIncorrectas: {
      titulo: 'Dimensiones Incorrectas',
      mensaje: 'Las dimensiones deben Ser'
    };
    Error_SeleccionarPagina: {
      titulo: '',
      mensaje: ''
    };

    // GETS
    getErrorDimensiones(): any {
      const error = {
        Error_DimensionesIncorrectas:  this.Error_DimensionesIncorrectas,
      };
      return error;
    }
    getErrorSeleccionPagina(): any {
      const error = {
        Error_DimensionesIncorrectastitulo:  {
          titulo: this.Error_SeleccionarPagina.titulo,
          mensaje: this.Error_SeleccionarPagina.mensaje
        },
      };
      return error;
    }
    getErrors(): any {
      const error = {
        Error_DimensionesIncorrectas:  this.Error_DimensionesIncorrectas,
        Error_SeleccionarPagina: this.Error_SeleccionarPagina
      };
      return error;
    }
}

