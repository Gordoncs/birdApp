import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComeComponent } from './come.component';

describe('ComeComponent', () => {
  let component: ComeComponent;
  let fixture: ComponentFixture<ComeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
