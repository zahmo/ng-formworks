import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentRef } from '@angular/core';
import { Framework, FrameworkLibraryService, JsonSchemaFormService, SelectWidgetComponent, WidgetLibraryService } from '@ng-formworks/core';
import { CssFrameworkComponent } from './css-framework.component';
import { CSS_FRAMEWORK_CFG } from './css-framework.defs';

describe('CssFrameworkComponent', () => {
  let component: CssFrameworkComponent;
  let fixture: ComponentFixture<CssFrameworkComponent>;
  let componentRef:ComponentRef<CssFrameworkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CssFrameworkComponent,SelectWidgetComponent],
      providers:[JsonSchemaFormService,
        WidgetLibraryService,
        {provide:CSS_FRAMEWORK_CFG,useValue:{}},
        {provide:Framework,useValue:[{name:"MockFramework"}] },
        FrameworkLibraryService,
        
        HttpClient,HttpHandler
      ]
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
