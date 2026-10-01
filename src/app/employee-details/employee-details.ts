import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmployeeService } from '../employee-service';
import { Employee } from '../employee';

@Component({
  selector: 'app-employee-details',
  imports: [RouterLink],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css',
})
export class EmployeeDetails implements OnInit {
  employee: Employee | null = null;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        console.log('Employee loaded:', employee);

        this.employee = employee;
        this.loading = false;

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);

        this.loading = false;
        this.errorMessage = 'Unable to load employee.';

        this.cdr.detectChanges();
      },
    });
  }
}
