import { Component } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-ag-date-gen-editor',
  templateUrl: './ag-date-gen-editor.component.html',
  styleUrls: ['./ag-date-gen-editor.component.css']
})
export class AgDateGenEditorComponent implements ICellEditorAngularComp  {

  private params: any;

  public selectedDate: Date = new Date();

  agInit(params: any): void {
      this.params = params;
  }

  getValue(): any {
      return `${this.selectedDate.getDate()}/${this.selectedDate.getMonth() + 1}/${this.selectedDate.getFullYear()}`;
  }

  isPopup(): boolean {
      return true;
  }

  onClick(date: Date) {
      this.selectedDate = date;
      this.params.api.stopEditing();
  }
}
