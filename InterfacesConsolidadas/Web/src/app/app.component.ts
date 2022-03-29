import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart, RoutesRecognized} from '@angular/router';

declare var $: any;
@Component({
    selector: 'my-app',
    templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
    constructor(private elRef: ElementRef) {
     }
    ngOnInit() {
        let body = document.getElementsByTagName('body')[0];
        var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
        if (isWindows) {
            // if we are on windows OS we activate the perfectScrollbar function
            body.classList.add("perfect-scrollbar-on");
        } else {
            body.classList.add("perfect-scrollbar-off");
        }
        $.material.init();

        window.loader = {
            hide: (delay:number = 0) => {
                setTimeout(function() {
                    $(".loader-container").css({ opacity: 0, "pointer-events": "none" });
                }, delay);
            },
            show: (delay:number = 0) => {
                setTimeout(function() {
                    $(".loader-container").css({ opacity: 1, "pointer-events": "auto" });
                }, delay);
            },
            toggle: (delay:number = 0) => {
                if ($(".loader-container").css("opacity") == 1) {
                    window.loader.hide(delay);
                    return;
                }
                window.loader.show(delay);
            }
        }
    }
}

export interface ILoader {
    show(delay?:number): void;
    hide(delay?:number): void;
    toggle(delay?:number): void;
}

declare global {
    interface Window {
        loader: ILoader;
    }
}
