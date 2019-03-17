import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KanlistComponent } from './kanlist.component';

describe('KanlistComponent', () => {
  let component: KanlistComponent;
  let fixture: ComponentFixture<KanlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KanlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KanlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
