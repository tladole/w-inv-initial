import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryProcureComponent } from './inventory-procure.component';

describe('InventoryProcureComponent', () => {
  let component: InventoryProcureComponent;
  let fixture: ComponentFixture<InventoryProcureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryProcureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryProcureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
