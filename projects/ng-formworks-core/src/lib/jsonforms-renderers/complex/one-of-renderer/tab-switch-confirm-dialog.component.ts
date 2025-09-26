import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tab-switch-confirm-dialog',
  template: `
    <mat-dialog-content>
    <p>Are you sure you want to switch tabs?</p>
    </mat-dialog-content>
    <mat-dialog-actions>
        <button mat-button (click)="cancel.emit()">Cancel</button>
        <button mat-button (click)="confirm.emit()">Confirm</button>
    </mat-dialog-actions>
    `,
    "standalone":false
  
})
export class TabSwitchConfirmDialogComponent {
  @Input() open: boolean = false;
  @Input() id: string = '';
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  handleClose() {
    this.close.emit();
  }
}
