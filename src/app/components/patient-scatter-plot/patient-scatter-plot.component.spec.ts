import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientScatterPlotComponent } from './patient-scatter-plot.component';

describe('PatientScatterPlotComponent', () => {
  let component: PatientScatterPlotComponent;
  let fixture: ComponentFixture<PatientScatterPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientScatterPlotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientScatterPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
