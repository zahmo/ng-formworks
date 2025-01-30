import { CommonModule } from '@angular/common';
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  JsonSchemaFormModule,
  JsonSchemaFormService,
  WidgetLibraryModule
} from '@ng-formworks/core';
import { Bootstrap4FrameworkComponent } from './bootstrap4-framework.component';

describe('FwBootstrap4Component', () => {
  let component: Bootstrap4FrameworkComponent;
  let fixture: ComponentFixture<Bootstrap4FrameworkComponent>;
  let componentRef:ComponentRef<Bootstrap4FrameworkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        JsonSchemaFormModule,
        CommonModule,
        WidgetLibraryModule,
      ],
      declarations: [Bootstrap4FrameworkComponent],
      providers: [JsonSchemaFormService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Bootstrap4FrameworkComponent);
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
