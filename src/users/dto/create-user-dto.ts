import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string
    @IsEmail()
    email: string
    @IsEnum(['ADMIN', 'INTERN', 'ENGINEER'], {
        message: "Role Is Not Valid, you have to give role ADMIN, INTERN, ENGINEER types"
    })
    role: 'ADMIN' | 'INTERN' | 'ENGINEER'
}