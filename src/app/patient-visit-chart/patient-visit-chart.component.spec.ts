import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientVisitChartComponent } from './patient-visit-chart.component';

describe('PatientVisitChartComponent', () => {
  let component: PatientVisitChartComponent;
  let fixture: ComponentFixture<PatientVisitChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientVisitChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientVisitChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
