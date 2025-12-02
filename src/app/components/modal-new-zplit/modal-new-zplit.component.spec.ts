import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewZplitComponent } from './modal-new-zplit.component';

describe('ModalNewZplitComponent', () => {
  let component: ModalNewZplitComponent;
  let fixture: ComponentFixture<ModalNewZplitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNewZplitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNewZplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
