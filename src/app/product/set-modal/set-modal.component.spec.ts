import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetModalComponent } from './set-modal.component';

describe('SetModalComponent', () => {
  let component: SetModalComponent;
  let fixture: ComponentFixture<SetModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
