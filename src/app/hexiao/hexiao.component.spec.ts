import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HexiaoComponent } from './hexiao.component';

describe('HexiaoComponent', () => {
  let component: HexiaoComponent;
  let fixture: ComponentFixture<HexiaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HexiaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HexiaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
