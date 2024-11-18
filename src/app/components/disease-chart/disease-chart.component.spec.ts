import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseChartComponent } from './disease-chart.component';

describe('DiseaseChartComponent', () => {
  let component: DiseaseChartComponent;
  let fixture: ComponentFixture<DiseaseChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiseaseChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiseaseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
