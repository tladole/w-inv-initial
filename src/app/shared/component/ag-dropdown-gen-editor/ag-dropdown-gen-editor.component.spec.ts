import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgDropdownGenEditorComponent } from './ag-dropdown-gen-editor.component';

describe('AgDropdownGenEditorComponent', () => {
  let component: AgDropdownGenEditorComponent;
  let fixture: ComponentFixture<AgDropdownGenEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgDropdownGenEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgDropdownGenEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
