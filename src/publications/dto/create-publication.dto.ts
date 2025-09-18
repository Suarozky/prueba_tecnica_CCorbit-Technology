import { IsNotEmpty, IsString, IsNumber, MaxLength } from 'class-validator';

export class CreatePublicationDto {
  @IsNotEmpty({ message: 'El título es requerido' })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @MaxLength(200, { message: 'El título no puede exceder 200 caracteres' })
  title: string;

  @IsNotEmpty({ message: 'El contenido es requerido' })
  @IsString({ message: 'El contenido debe ser una cadena de texto' })
  content: string;

  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
  userId: number;
}