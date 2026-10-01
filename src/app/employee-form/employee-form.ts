import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../employee-service';

@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css',
})
export class EmployeeForm implements OnInit {
  isEditMode = false;
  employeeId = 0;
  errorMessage = '';

  employeeForm;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.employeeForm = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      role: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.employeeId = Number(id);
      this.loadEmployee();
    }
  }

  loadEmployee(): void {
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue({
          name: employee.name,
          email: employee.email,
          department: employee.department,
          role: employee.role,
          salary: employee.salary,
        });
      },
      error: () => {
        this.errorMessage = 'Unable to load employee.';
      },
    });
  }

  saveEmployee(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const employee = this.employeeForm.getRawValue();

    if (this.isEditMode) {
      this.employeeService.updateEmployee(this.employeeId, employee).subscribe({
        next: () => this.router.navigate(['/employees']),
        error: () => {
          this.errorMessage = 'Unable to update employee.';
        },
      });
    } else {
      this.employeeService.addEmployee(employee).subscribe({
        next: () => this.router.navigate(['/employees']),
        error: () => {
          this.errorMessage = 'Unable to add employee.';
        },
      });
    }
  }

  clearForm(): void {
    this.employeeForm.reset({
      name: '',
      email: '',
      department: '',
      role: '',
      salary: 0,
    });
  }
}
