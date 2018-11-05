import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddresComponent } from './addres.component';

describe('AddresComponent', () => {
  let component: AddresComponent;
  let fixture: ComponentFixture<AddresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
