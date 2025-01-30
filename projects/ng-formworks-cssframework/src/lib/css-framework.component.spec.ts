import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentRef } from '@angular/core';
import { CssFrameworkComponent } from './css-framework.component';

describe('CssFrameworkComponent', () => {
  let component: CssFrameworkComponent;
  let fixture: ComponentFixture<CssFrameworkComponent>;
  let componentRef:ComponentRef<CssFrameworkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CssFrameworkComponent]
    });
    fixture = TestBed.createComponent(CssFrameworkComponent);
    component = fixture.componentInstance;
    componentRef=fixture.componentRef;
    componentRef.setInput('layoutNode',{ options: {} });
    componentRef.setInput('layoutIndex',[]);
    componentRef.setInput('dataIndex',[]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
