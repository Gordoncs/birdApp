import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialgoodsComponent } from './specialgoods.component';

describe('SpecialgoodsComponent', () => {
  let component: SpecialgoodsComponent;
  let fixture: ComponentFixture<SpecialgoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialgoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialgoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
