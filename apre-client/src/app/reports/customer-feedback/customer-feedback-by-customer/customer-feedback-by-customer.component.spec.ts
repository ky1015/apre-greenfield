import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomerFeedbackByCustomerComponent } from './customer-feedback-by-customer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from '../../../shared/table/table.component';

describe('CustomerFeedbackByCustomerComponent', () => {
  let component: CustomerFeedbackByCustomerComponent;
  let fixture: ComponentFixture<CustomerFeedbackByCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerFeedbackByCustomerComponent, HttpClientTestingModule, ReactiveFormsModule, TableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerFeedbackByCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test to display title "Customer Feedback by Customer"
  it('should display the title "Customer Feedback by Customer"', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Customer Feedback by Customer');
  });

  it('should initialize the customerFeedbackForm with a null value', () => {
    const customerControl = component.customerFeedbackForm.controls['customer'];
    expect(customerControl.value).toBeNull();
    expect(customerControl.valid).toBeFalse();
  });

  it('should not submit the form if no customer is selected', () => {
    spyOn(component, 'onSubmit').and.callThrough();

    const compiled = fixture.nativeElement;
    const submitButton = compiled.querySelector('.form__actions button');
    submitButton.click();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.customerFeedbackForm.valid).toBeFalse();
  });
});
