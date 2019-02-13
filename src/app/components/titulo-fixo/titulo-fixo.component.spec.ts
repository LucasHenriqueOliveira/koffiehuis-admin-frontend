import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TituloFixoComponent } from './titulo-fixo.component';

describe('TituloFixoComponent', () => {
  let component: TituloFixoComponent;
  let fixture: ComponentFixture<TituloFixoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TituloFixoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TituloFixoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
