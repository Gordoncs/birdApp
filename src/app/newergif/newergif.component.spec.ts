import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewergifComponent } from './newergif.component';

describe('NewergifComponent', () => {
  let component: NewergifComponent;
  let fixture: ComponentFixture<NewergifComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewergifComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewergifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
