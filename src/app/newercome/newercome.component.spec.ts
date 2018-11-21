import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewercomeComponent } from './newercome.component';

describe('NewercomeComponent', () => {
  let component: NewercomeComponent;
  let fixture: ComponentFixture<NewercomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewercomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewercomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
