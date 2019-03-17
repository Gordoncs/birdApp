import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndecComponent } from './indec.component';

describe('IndecComponent', () => {
  let component: IndecComponent;
  let fixture: ComponentFixture<IndecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
