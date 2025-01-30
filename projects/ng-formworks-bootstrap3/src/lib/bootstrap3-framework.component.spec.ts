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
import { Bootstrap3FrameworkComponent } from './bootstrap3-framework.component';

describe('Bootstrap3FrameworkComponent', () => {
  let component: Bootstrap3FrameworkComponent;
  let fixture: ComponentFixture<Bootstrap3FrameworkComponent>;
  let componentRef:ComponentRef<Bootstrap3FrameworkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        JsonSchemaFormModule,
        CommonModule,
        WidgetLibraryModule,
      ],
      declarations: [Bootstrap3FrameworkComponent,CssFrameworkComponent],
      providers: [JsonSchemaFormService, HttpClient,HttpHandler]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Bootstrap3FrameworkComponent);
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
