import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReqComponent } from './inventory-req.component';

describe('InventoryReqComponent', () => {
  let component: InventoryReqComponent;
  let fixture: ComponentFixture<InventoryReqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryReqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
