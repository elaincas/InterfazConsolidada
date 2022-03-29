/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BandeosComponent } from './bandeos.component';

describe('BandeosComponent', () => {
  let component: BandeosComponent;
  let fixture: ComponentFixture<BandeosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandeosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandeosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
