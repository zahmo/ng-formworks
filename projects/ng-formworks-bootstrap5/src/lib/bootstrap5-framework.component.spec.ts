import { CommonModule } from '@angular/common';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  JsonSchemaFormModule,
  JsonSchemaFormService,
  WidgetLibraryModule
} from '@ng-formworks/core';
import { CssFrameworkComponent } from '@ng-formworks/cssframework';
import { Bootstrap5FrameworkComponent } from './bootstrap5-framework.component';

describe('Bootstrap5FrameworkComponent', () => {
  let component: Bootstrap5FrameworkComponent;
  let fixture: ComponentFixture<Bootstrap5FrameworkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        JsonSchemaFormModule,
        CommonModule,
        WidgetLibraryModule
      ],
      declarations: [Bootstrap5FrameworkComponent,CssFrameworkComponent],
      providers: [JsonSchemaFormService, HttpClient,HttpHandler]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Bootstrap5FrameworkComponent);
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
