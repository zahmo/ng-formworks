import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { Framework, FrameworkLibraryService, JsonSchemaFormService, SelectWidgetComponent, WidgetLibraryService } from '@ng-formworks/core';
import { CssFrameworkComponent } from './css-framework.component';
import { CSS_FRAMEWORK_CFG } from './css-framework.defs';

describe('CssFrameworkComponent', () => {
  let component: CssFrameworkComponent;
  let fixture: ComponentFixture<CssFrameworkComponent>;

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
    component.layoutNode = { options: {} };
    component.layoutIndex = [];
    component.dataIndex = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
