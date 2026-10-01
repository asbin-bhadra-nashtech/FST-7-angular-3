import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../employee-service';
import { Employee } from '../employee';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeList implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];

  loading = false;
  errorMessage = '';

  searchText = '';
  selectedDepartment = 'All';
  sortBy = 'name';

  constructor(
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.errorMessage = '';

    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.loading = false;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Unable to load employees. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  applyFilters(): void {
    let result = this.employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        employee.email.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesDepartment =
        this.selectedDepartment === 'All' || employee.department === this.selectedDepartment;

      return matchesSearch && matchesDepartment;
    });

    result = [...result].sort((a, b) => {
      if (this.sortBy === 'salary') {
        return b.salary - a.salary;
      }

      return a.name.localeCompare(b.name);
    });

    this.filteredEmployees = result;
  }

  deleteEmployee(id: number): void {
    const confirmed = window.confirm('Are you sure you want to delete this employee?');

    if (!confirmed) {
      return;
    }

    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.employees = this.employees.filter((employee) => employee.id !== id);

        this.applyFilters();
      },
      error: () => {
        this.errorMessage = 'Unable to delete the employee.';
      },
    });
  }
}
