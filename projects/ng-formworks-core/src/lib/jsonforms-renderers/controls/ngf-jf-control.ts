import { JsonFormsAngularService, JsonFormsControl } from "@jsonforms/angular";
import { JsonFormsState, StatePropsOfControl } from "@jsonforms/core";

export abstract class NGFJsonFormsControl extends JsonFormsControl {

  abstract getContext(): JsonFormsControl | NGFJsonFormsControl;

  private applyMethod(methodName: string, args: any) {
    let isSelf = this.getContext() == this;
    if (!isSelf && this.getContext()?.[methodName]) {
      return this.getContext()[methodName].apply(this.getContext(), args)
    }
    return super[methodName].apply(this, args);
  }
  constructor(protected jsonFormsService: JsonFormsAngularService) {
    super(jsonFormsService);
    //console.log("NGFJsonFormsControl created")
  }


  getEventValue = (event: any) =>{
    let isSelf = this.getContext() == this;
    if(!isSelf && this.getContext()?.getEventValue){
      return this.getContext().getEventValue(event);
    }
    return event.target.value || undefined
  }

  getForm(){
    return this.getContext()?.form||this.form;
  }

  onChange(ev: any) {
    this.applyMethod('onChange', arguments);
  }

  mapAdditionalProps(props: StatePropsOfControl) {
    this.applyMethod('mapAdditionalProps', arguments);
  }
  getValue() {
    return this.applyMethod('getValue', arguments);

  }

  mapToProps(state: JsonFormsState): StatePropsOfControl {
    return this.applyMethod('mapToProps', arguments);
  }

}
