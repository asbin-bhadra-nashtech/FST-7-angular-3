import { Routes } from '@angular/router';
import { EmployeeList } from './employee-list/employee-list';
import { EmployeeForm } from './employee-form/employee-form';
import { EmployeeDetails } from './employee-details/employee-details';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'employees',
    pathMatch: 'full',
  },
  {
    path: 'employees',
    component: EmployeeList,
  },
  {
    path: 'employees/new',
    component: EmployeeForm,
  },
  {
    path: 'employees/:id',
    component: EmployeeDetails,
  },
  {
    path: 'employees/:id/edit',
    component: EmployeeForm,
  },
  {
    path: '**',
    redirectTo: 'employees',
  },
];
