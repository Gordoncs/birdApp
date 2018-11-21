import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewerdecComponent } from './newerdec.component';

describe('NewerdecComponent', () => {
  let component: NewerdecComponent;
  let fixture: ComponentFixture<NewerdecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewerdecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewerdecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
