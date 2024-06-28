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
