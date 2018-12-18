import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QiangpageComponent } from './qiangpage.component';

describe('QiangpageComponent', () => {
  let component: QiangpageComponent;
  let fixture: ComponentFixture<QiangpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QiangpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QiangpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
