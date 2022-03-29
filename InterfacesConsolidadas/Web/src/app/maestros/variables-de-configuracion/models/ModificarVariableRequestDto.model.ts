import { VariableDeConfiguracion } from "./VariableDeConfiguracion.model";

export interface ModificarVariableRequestDto {
    usuarioId: number;
    sucursales: number[];
    variable: VariableDeConfiguracion;
}