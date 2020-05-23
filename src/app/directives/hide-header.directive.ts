import { Directive, HostListener, Input, OnInit, Renderer2, Inject } from '@angular/core';
import { DomController } from '@ionic/angular';
import { DOCUMENT } from '@angular/common';

@Directive({
    selector: '[appHideHeader]'
})
export class HideHeaderDirective implements OnInit {

    @Input('header') header: any;
    element: any = null;
    private lastY = 0;

    constructor(
        @Inject(DOCUMENT) document,
        private renderer: Renderer2,
        private domCtrl: DomController
    ) { }

    ngOnInit(): void {
      console.log('this.header :>> ', this.header);
      // this.element = this.renderer.selectRootElement('.myclass');
        // this.element = this.renderer.selectRootElement('app-page-header', true);
        this.element = document.getElementById('navbar');
        this.header = this.element;

    }

    @HostListener('ionScroll', ['$event']) onContentScroll($event: any) {
        if ($event.detail.scrollTop > this.lastY) {
          this.element.classList.add('sticky');
          this.domCtrl.write(() => {
            this.renderer.setStyle(this.header, 'transition', 'margin-top 700ms');
         });
            // this.domCtrl.write(() => {
            //     this.renderer.setStyle(this.header, 'margin-top', `-${this.element.clientHeight}px`);
            // });
        } else {

          this.element.classList.remove('sticky');
            // this.domCtrl.write(() => {
            //     this.renderer.setStyle(this.header, 'margin-top', '0');
            // });
        }

        this.lastY = $event.detail.scrollTop;
    }

}
