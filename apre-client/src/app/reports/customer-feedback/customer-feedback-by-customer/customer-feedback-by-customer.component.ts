import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableComponent } from './../../../shared/table/table.component';

@Component({
  selector: 'app-customer-feedback-by-customer',
  standalone: true,
  imports: [TableComponent, ReactiveFormsModule],
  template: `
    <h1>Customer Feedback by Customer</h1>
    <div class="feedback-container">
      <form class="form" [formGroup]="customerFeedbackForm" (ngSubmit)="onSubmit()">
        <div class="form__group">
          <label class="label" for="customer">Feedback</label>
          <select class="select" formControlName="customer" id="customer" name="customer">
            @for(customer of customers; track customer) {
              <option value="{{ customer }}">{{ customer }}</option>
            }
          </select>
        </div>
        <div class="form__actions">
          <button class="button button--primary" type="submit">Submit</button>
        </div>
      </form>
      @if (feedback.length > 0) {
        <div class="card chart-card">
          <app-table
            [title]="'Customer Feedback by Customer'"
            [data]="feedback"
            [headers]="['Customer', 'Customer Feedback']"
            [sortableColumns]="['Customer']"
            [headerBackground]="'secondary'"
            >
          </app-table>
        </div>
      }
    </div>
  `,
  styles: `
    .feedback-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .form, .chart-card {
      width: 50%;
      margin: 20px 0;
      padding: 10px;
    }
    app-table {
      padding: 50px;
    }
  `
})

export class CustomerFeedbackByCustomerComponent {
  feedback: any[] = [];
  customers: string[] = [];

  customerFeedbackForm = this.fb.group({
    customer: [null, Validators.compose([Validators.required])]
  });

  constructor(private http: HttpClient, private fb: FormBuilder) {
    // fetch ids to populate dropdown menu
    this.http.get(`${environment.apiBaseUrl}/reports/customer-feedback/customers`).subscribe({
      next: (data: any) => {
        this.customers = data;
      },
      error: (err) => {
        console.error('Error fetching customers: ', err);
      }
    });
  }

  onSubmit() {
    //fetch data for specified agent Id
    const customer = this.customerFeedbackForm.controls['customer'].value;

    this.http.get(`${environment.apiBaseUrl}/reports/customer-feedback/customer-feedback-by-customer/${customer}`).subscribe({
      next: (data: any) => {
        this.feedback = data.map((item: any) => {
          // Flatten the feedback array into separate rows for each feedback
          return item.feedback.map((feedbackText: string) => ({
            Customer: item.customer,
            'Customer Feedback': feedbackText
          }));
        }).flat();

        console.log('Customer Feedback Client side:', this.feedback);
      },
      error: (err) => {
        console.error('Error fetching customer feedback:', err);
      }
    });
  }
}
