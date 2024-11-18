import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedAnalysisComponent } from './advanced-analysis.component';

describe('AdvancedAnalysisComponent', () => {
  let component: AdvancedAnalysisComponent;
  let fixture: ComponentFixture<AdvancedAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
