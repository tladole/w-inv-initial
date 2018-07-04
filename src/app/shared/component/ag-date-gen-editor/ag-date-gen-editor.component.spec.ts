import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgDateGenEditorComponent } from './ag-date-gen-editor.component';

describe('AgDateGenEditorComponent', () => {
  let component: AgDateGenEditorComponent;
  let fixture: ComponentFixture<AgDateGenEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgDateGenEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgDateGenEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
