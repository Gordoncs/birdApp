import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqiComponent } from './faqi.component';

describe('FaqiComponent', () => {
  let component: FaqiComponent;
  let fixture: ComponentFixture<FaqiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
