<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

This project is a REST API built with the NestJS framework and Prisma ORM, using PostgreSQL as the database. Additionally, it includes validation, pipes, rate limiting, exception filters, DTO schema, and integration with Neon Postgres.

## Installation

```bash
$ npm install
```

## Environment Setup
To run this project, you need to create a Prisma account and set up the DATABASE_URL in the .env file located in the project root directory.
```bash
DATABASE_URL="your_database_url_here"
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


## Endpoints

```bash
# Get employees by role
GET /api/employees?role='ROLE'
  #Role values can be ADMIN, INTERN, or ENGINEER.
```

```bash
# Get an employee by ID
GET /api/employees/id
```

```bash
# Create an employee 
POST /api/employees
```

```bash
# Delete an employee 
DELETE /api/employees/id
```

```bash
# Update an employee
PATCH /api/employees/id
```

# Postman Collection
All endpoints are available in a ready-to-use Postman collection included in the project. You can import this collection to Postman to test the endpoints visually.
  
# Validation and Pipes
This project uses NestJS built-in validation and pipes to ensure data integrity and transformation. Validators are used to enforce rules and constraints on the incoming data.

# Rate Limiting
Rate limiting is implemented to prevent abuse and ensure the API's availability. You can configure rate limiting settings in the app.module.ts and employees.controller file.



```
// Create Employee Dto 

import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator"

export class CreateEmployeeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsEnum(['ADMIN', 'INTERN', 'ENGINEER'], {
        message: "Role Is Not Valid, you have to give role ADMIN, INTERN, ENGINEER types"
    })
    role: 'ADMIN' | 'INTERN' | 'ENGINEER';}
```

```
// Update Employee Dto 
import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}

```

```
//Use Validation in Employee Controller 

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Ip, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Prisma } from '@prisma/client';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { CustomLoggerService } from 'src/custom-logger/custom-logger.service';

import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';


@SkipThrottle()
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) { }
  private readonly customLogger = new CustomLoggerService(EmployeesController.name);
  @Post()
  create(@Body(ValidationPipe) createEmployeeDto: CreateEmployeeDto) {
    //do not use createEmployeeDto you can use Prisma.EmployeeCreateInput instead of CreateEmployeeDto but we are using validation over here
    return this.employeesService.create(createEmployeeDto);
  }


  @SkipThrottle({ default: false })
  @Get()
  findAll(@Ip() ip: string, @Query('role') role?: 'INTERN' | 'ADMIN' | 'ENGINEER') {
    this.customLogger.log(`Request for all employes \t${ip}`, EmployeesController.name);
    return this.employeesService.findAll(role);
  }

  //if you don't have any throttle name you can use default instead of short 
  @Throttle({ short: { ttl: 1000, limit: 1 } })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.remove(id);
  }
}
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
