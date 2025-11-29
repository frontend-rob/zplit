import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZplitsComponent } from './zplits.component';

describe('ZplitsComponent', () => {
  let component: ZplitsComponent;
  let fixture: ComponentFixture<ZplitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZplitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZplitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
