import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JustpayComponent } from './justpay.component';

describe('JustpayComponent', () => {
  let component: JustpayComponent;
  let fixture: ComponentFixture<JustpayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JustpayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JustpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
