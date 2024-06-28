import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';

@Injectable()
export class UsersService {
    private users = [
        {
            "id": 1,
            "name": "Hümeyra",
            "email": "humeyra@gmail.com",
            "role": "ADMIN",
        },
        {
            "id": 2,
            "name": "Enes",
            "email": "enes@gmail.com",
            "role": "INTERN",
        },
        {
            "id": 3,
            "name": "Ramazan",
            "email": "ramazan@gmail.com",
            "role": "ENGINEER",
        },
        {
            "id": 4,
            "name": "Mucahit",
            "email": "mucahit@gmail.com",
            "role": "INTERN",
        },
        {
            "id": 5,
            "name": "Ipek",
            "email": "ipek@gmail.com",
            "role": "INTERN",
        },
        {
            "id": 6,
            "name": "Basak",
            "email": "basak@gmail.com",
            "role": "ENGINEER",
        },
        {
            "id": 7,
            "name": "Selim",
            "email": "selim@gmail.com",
            "role": "ENGINEER",
        },
        {
            "id": 8,
            "name": "Yesim",
            "email": "yesim@gmail.com",
            "role": "ADMIN",
        },
        {
            "id": 9,
            "name": "Hadice",
            "email": "hadice@gmail.com",
            "role": "INTERN",
        },
        {
            "id": 10,
            "name": "İhsan",
            "email": "ihsan@gmail.com",
            "role": "ENGINEER",
        },
    ];

    finAllUsers(role?: 'ADMIN' | 'ENGINEER' | 'INTERN') {
        if (role) {
            return this.users.filter(user => user.role === role);
        }
        return this.users;
    }

    findUserById(id: number) {
        const user = this.users.find(user => user.id === id);
        return user;
    }

    createUser(createUserDto: CreateUserDto) {
        const usersByHighestId = [...this.users].sort((a, b) => b.id - a.id);
        const newUser = {
            id: usersByHighestId[0].id + 1,
            ...createUserDto
        }
        this.users.push(newUser);
        return newUser;
    }

    updateUser(id: number, UpdateUserDto: UpdateUserDto) {
        this.users = this.users.map(user => {
            if (user.id === id) {
                return { ...user, ...UpdateUserDto };
            }
            return user;
        });
        return this.findUserById(id);
    }

    deleteUser(id: number) {
        const removeUser = this.findUserById(id);
        this.users = this.users.filter(user => user.id !== id);
        return removeUser;
    }
}
""