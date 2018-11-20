import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreetakeComponent } from './freetake.component';

describe('FreetakeComponent', () => {
  let component: FreetakeComponent;
  let fixture: ComponentFixture<FreetakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreetakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreetakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
