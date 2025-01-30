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
import { DaisyUIFrameworkComponent } from './daisyui-framework.component';

describe('DaisyUIFrameworkComponent', () => {
  let component: DaisyUIFrameworkComponent;
  let fixture: ComponentFixture<DaisyUIFrameworkComponent>;
  let componentRef:ComponentRef<DaisyUIFrameworkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        JsonSchemaFormModule,
        CommonModule,
        WidgetLibraryModule
      ],
      declarations: [DaisyUIFrameworkComponent,CssFrameworkComponent],
      providers: [JsonSchemaFormService, HttpClient,HttpHandler]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DaisyUIFrameworkComponent]
    });
    fixture = TestBed.createComponent(DaisyUIFrameworkComponent);
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
