import { CommonModule } from '@angular/common';
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  JsonSchemaFormModule,
  JsonSchemaFormService,
  WidgetLibraryModule
} from '@ng-formworks/core';
import { Bootstrap5FrameworkComponent } from './bootstrap5-framework.component';

describe('Bootstrap5Component', () => {
  let component: Bootstrap5FrameworkComponent;
  let fixture: ComponentFixture<Bootstrap5FrameworkComponent>;
  let componentRef:ComponentRef<Bootstrap5FrameworkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        JsonSchemaFormModule,
        CommonModule,
        WidgetLibraryModule,
      ],
      declarations: [Bootstrap5FrameworkComponent],
      providers: [JsonSchemaFormService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Bootstrap5FrameworkComponent);
    component = fixture.componentInstance;
    componentRef=fixture.componentRef;
    componentRef.setInput('layoutNode',{ options: {} });
    componentRef.setInput('layoutIndex',[]);
    componentRef.setInput('dataIndex',[]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
