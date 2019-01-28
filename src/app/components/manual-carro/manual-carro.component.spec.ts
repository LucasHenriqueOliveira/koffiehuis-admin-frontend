import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualCarroComponent } from './manual-carro.component';

describe('ManualCarroComponent', () => {
  let component: ManualCarroComponent;
  let fixture: ComponentFixture<ManualCarroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualCarroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualCarroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
