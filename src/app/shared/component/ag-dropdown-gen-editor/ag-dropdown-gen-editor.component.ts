import { AfterViewInit, Component, ViewChild, ViewContainerRef } from "@angular/core";
import { ICellEditorAngularComp } from "ag-grid-angular";

@Component({
  selector: 'app-ag-dropdown-gen-editor',
  templateUrl: './ag-dropdown-gen-editor.component.html'
})
export class AgDropdownGenEditorComponent implements ICellEditorAngularComp, AfterViewInit {
  private params: any;
  public value: string;
  private cancelBeforeStart: boolean = false;

  @ViewChild('input', { read: ViewContainerRef }) public input;
  valueToShow: string;

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;
    this.valueToShow = this.params.valueToShow;
    console.log("in custom edit", this)
    // only start edit if key pressed is a number, not a letter
    // this.cancelBeforeStart = params.charPress && ('1234567890'.indexOf(params.charPress) < 0);
  }

  getValue(): any {
    return this.value;
  }

  isCancelBeforeStart(): boolean {
    return this.cancelBeforeStart;
  }

  // will reject the number if it greater than 1,000,000
  // not very practical, but demonstrates the method.
  isCancelAfterEnd(): boolean {
    return false; // this.value > 1000000;
  };

  onKeyDown(event): void {
    // if (!this.isKeyPressedNumeric(event)) {
    //   if (event.preventDefault) event.preventDefault();
    // }
  }

  isPopup(): boolean {
    return false;
  };

  // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
  ngAfterViewInit() {
    setTimeout(() => {
      this.input.element.nativeElement.focus();
    })
  }

  private getCharCodeFromEvent(event): any {
    event = event || window.event;
    return (typeof event.which == "undefined") ? event.keyCode : event.which;
  }

  private isCharNumeric(charStr): boolean {
    return !!/\d/.test(charStr);
  }

  private isKeyPressedNumeric(event): boolean {
    const charCode = this.getCharCodeFromEvent(event);
    const charStr = event.key ? event.key : String.fromCharCode(charCode);
    return this.isCharNumeric(charStr);
  }

}
