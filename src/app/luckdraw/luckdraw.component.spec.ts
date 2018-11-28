import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LuckdrawComponent } from './luckdraw.component';

describe('LuckdrawComponent', () => {
  let component: LuckdrawComponent;
  let fixture: ComponentFixture<LuckdrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LuckdrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuckdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
