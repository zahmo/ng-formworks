import { CommonModule } from '@angular/common';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  JsonSchemaFormModule,
  JsonSchemaFormService,
  WidgetLibraryModule
} from '@ng-formworks/core';
import { CssFrameworkComponent } from '@ng-formworks/cssframework';
import { DaisyUIFrameworkComponentPrefixed } from './daisyui-framework.prefixed.component';

describe('DaisyUIFrameworkComponentPrefixed', () => {
  let component: DaisyUIFrameworkComponentPrefixed;
  let fixture: ComponentFixture<DaisyUIFrameworkComponentPrefixed>;
  let componentRef:ComponentRef<DaisyUIFrameworkComponentPrefixed>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        JsonSchemaFormModule,
        CommonModule,
        WidgetLibraryModule
      ],
      declarations: [DaisyUIFrameworkComponentPrefixed,CssFrameworkComponent],
      providers: [JsonSchemaFormService, HttpClient,HttpHandler]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DaisyUIFrameworkComponentPrefixed]
    });
    fixture = TestBed.createComponent(DaisyUIFrameworkComponentPrefixed);
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
