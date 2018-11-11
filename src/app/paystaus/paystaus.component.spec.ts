import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaystausComponent } from './paystaus.component';

describe('PaystausComponent', () => {
  let component: PaystausComponent;
  let fixture: ComponentFixture<PaystausComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaystausComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaystausComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
