import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonformsFormComponent } from './jsonforms-form.component';

describe('JsonformsFormComponent', () => {
  let component: JsonformsFormComponent;
  let fixture: ComponentFixture<JsonformsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonformsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonformsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
