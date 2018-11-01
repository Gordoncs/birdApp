import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaysureComponent } from './paysure.component';

describe('PaysureComponent', () => {
  let component: PaysureComponent;
  let fixture: ComponentFixture<PaysureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaysureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaysureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
