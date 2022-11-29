/* eslint-disable */
import {
  AfterContentChecked,
  Directive,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  ChangeDetectorRef,
} from '@angular/core';

@Directive({
  selector: '[fuseIfOnDom]',
})
export class FuseIfOnDomDirective implements AfterContentChecked {
  isCreated = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private element: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterContentChecked() {
    if (document.body.contains(this.element.nativeElement) && !this.isCreated) {
      setTimeout(() => {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.cdr.detectChanges();
      }, 350);
      this.isCreated = true;
    } else if (this.isCreated && !document.body.contains(this.element.nativeElement)) {
      this.viewContainer.clear();
      this.isCreated = false;
    }
  }
}
