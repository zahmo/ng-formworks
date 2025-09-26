
export abstract class ContextControl {

  abstract getContext(): any

  protected applyMethod(rootObj=this.getContext(),methodName: string,...args: any) {
    let thisObj=this.getContext();
    return rootObj[methodName].apply(thisObj, args);
  }
  constructor() {
 
  }


}
