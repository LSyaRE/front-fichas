import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRecord } from './view-record';

describe('ViewRecord', () => {
  let component: ViewRecord;
  let fixture: ComponentFixture<ViewRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRecord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRecord);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
