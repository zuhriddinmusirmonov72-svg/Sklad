import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { FilterCustomerDto } from './dto/filter-customer.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Mijozlar')
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Create new customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  @ApiResponse({ status: 409, description: 'Customer already exists' })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get all customers with filters' })
  @ApiResponse({ status: 200, description: 'Customers retrieved successfully' })
  findAll(@Query() filterDto: FilterCustomerDto) {
    return this.customersService.findAll(filterDto);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.findOne(id);
  }

  @Get(':id/history')
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get customer order history' })
  @ApiResponse({ status: 200, description: 'Customer history retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  getHistory(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.getCustomerHistory(id);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Update customer' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 409, description: 'Phone or email already exists' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete customer' })
  @ApiResponse({ status: 200, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 409, description: 'Cannot delete customer with orders' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.remove(id);
  }
}
