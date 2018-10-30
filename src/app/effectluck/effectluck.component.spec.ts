import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectluckComponent } from './effectluck.component';

describe('EffectluckComponent', () => {
  let component: EffectluckComponent;
  let fixture: ComponentFixture<EffectluckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EffectluckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EffectluckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
