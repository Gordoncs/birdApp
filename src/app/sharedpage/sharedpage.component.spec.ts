import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedpageComponent } from './sharedpage.component';

describe('SharedpageComponent', () => {
  let component: SharedpageComponent;
  let fixture: ComponentFixture<SharedpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
