import { CommonModule } from '@angular/common';
import { HttpClient, HttpHandler } from '@angular/common/http';
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
    component.layoutNode = { options: {} };
    component.layoutIndex = [];
    component.dataIndex = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
