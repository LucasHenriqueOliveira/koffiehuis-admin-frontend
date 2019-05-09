import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluidoComponent } from './fluido.component';

describe('FluidoComponent', () => {
  let component: FluidoComponent;
  let fixture: ComponentFixture<FluidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
