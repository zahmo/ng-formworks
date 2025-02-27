import { Directive, ElementRef, Input, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[attributes]',
  standalone: false
})
export class ElementAttributeDirective {

 
  @Input()
  public attributes: { [key: string]: any; };

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.attributes) {
      for (let attributeName in this.attributes) {
        const attributeValue = this.attributes[attributeName];
        if (attributeValue) {
          this.renderer.setAttribute(this.elementRef.nativeElement, attributeName, attributeValue);
        } else {
          this.renderer.removeAttribute(this.elementRef.nativeElement, attributeName);
        }
      }
    }
  }

}
