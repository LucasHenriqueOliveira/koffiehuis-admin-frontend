import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopiaManualComponent } from './copia-manual.component';

describe('CopiaManualComponent', () => {
  let component: CopiaManualComponent;
  let fixture: ComponentFixture<CopiaManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopiaManualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopiaManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
