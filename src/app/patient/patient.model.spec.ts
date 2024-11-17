import { Patient } from './patient.model';

describe('Patient', () => {
  it('should create an instance', () => {
    const patient: Patient = {
      id: 1,
      name: 'Giovanni Rossi',
      age: 45,
      diagnosis: 'Influenza',
      lastVisit: '2024-11-10'
    };
    expect(patient).toBeTruthy();
  });
});
