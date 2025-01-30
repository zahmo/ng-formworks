import { CommonModule } from '@angular/common';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  JsonSchemaFormModule,
  JsonSchemaFormService,
  WidgetLibraryModule
} from '@ng-formworks/core';
import { MaterialDesignFrameworkComponent } from './material-design-framework.component';

describe('MaterialDesignFrameworkComponent', () => {
  let component: MaterialDesignFrameworkComponent;
  let fixture: ComponentFixture<MaterialDesignFrameworkComponent>;
  let componentRef:ComponentRef<MaterialDesignFrameworkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        JsonSchemaFormModule,
        CommonModule,
        WidgetLibraryModule,
      ],
      declarations: [MaterialDesignFrameworkComponent],
      providers: [JsonSchemaFormService,HttpClient,HttpHandler]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDesignFrameworkComponent);
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
