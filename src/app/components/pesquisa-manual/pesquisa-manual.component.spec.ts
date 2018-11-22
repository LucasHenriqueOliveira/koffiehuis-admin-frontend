import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PesquisaManualComponent } from './pesquisa-manual.component';

describe('PesquisaManualComponent', () => {
  let component: PesquisaManualComponent;
  let fixture: ComponentFixture<PesquisaManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PesquisaManualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PesquisaManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
