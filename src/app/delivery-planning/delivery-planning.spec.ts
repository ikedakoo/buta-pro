import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPlanning } from './delivery-planning';

describe('DeliveryPlanning', () => {
  let component: DeliveryPlanning;
  let fixture: ComponentFixture<DeliveryPlanning>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryPlanning]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryPlanning);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
