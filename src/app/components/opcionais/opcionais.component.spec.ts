import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcionaisComponent } from './opcionais.component';

describe('OpcionaisComponent', () => {
  let component: OpcionaisComponent;
  let fixture: ComponentFixture<OpcionaisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpcionaisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpcionaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
