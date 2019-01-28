import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualFixoComponent } from './manual-fixo.component';

describe('ManualFixoComponent', () => {
  let component: ManualFixoComponent;
  let fixture: ComponentFixture<ManualFixoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualFixoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualFixoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
