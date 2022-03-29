import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';

import * as Chartist from 'chartist';

declare var $: any;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, AfterViewInit {
    ngAfterViewInit(): void {
    }
    ngOnInit(): void {
        setTimeout(function() {
            window.loader.hide();
        }, 500);
    }
}
