import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutpromiseComponent } from './aboutpromise.component';

describe('AboutpromiseComponent', () => {
  let component: AboutpromiseComponent;
  let fixture: ComponentFixture<AboutpromiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutpromiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutpromiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
