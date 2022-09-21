import { AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({ selector: '[highlight]' })
export class HighlightDirective implements AfterViewInit {

    @Input() color = 'yellow';


    constructor(private el: ElementRef, private renderer: Renderer2) { }

    ngAfterViewInit() {
        this.setBgColor(this.color);
    }

    setBgColor(color: string) {
        this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
    }

    @HostListener('mouseenter') onMouseEnter() {
        this.setBgColor('lightblue');
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.setBgColor(this.color);
    }

    @HostListener('click') onClick() {
        this.color = 'lightgreen';
    }


}