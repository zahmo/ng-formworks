import { AutocompleteControlRendererCore, BooleanControlRendererCore, DateControlRendererCore, NumberControlRendererCore, RangeControlRendererCore, TextAreaRendererCore, ToggleControlRendererCore } from './controls';
import { InputControlRendererCore } from './controls/input.renderer';
import { ArrayLayoutRendererCore, CategorizationTabLayoutRendererCore, GroupLayoutRendererCore, HorizontalLayoutRendererCore, layoutChildrenRenderPropsCore, VerticalLayoutRendererCore } from './layouts';
import { GetPropsCore, JsonFormsDetailComponentCore, LabelRendererCore, MasterListComponentCore, ObjectControlRendererCore, TableRendererCore } from './other';


export const BASIC_RENDERERS = [
  InputControlRendererCore,
  BooleanControlRendererCore,
  TextAreaRendererCore,
  NumberControlRendererCore,
  RangeControlRendererCore,
  DateControlRendererCore,
  ToggleControlRendererCore,
  AutocompleteControlRendererCore,
  ObjectControlRendererCore,
  VerticalLayoutRendererCore,
  GroupLayoutRendererCore,
  HorizontalLayoutRendererCore,
  CategorizationTabLayoutRendererCore,
  LabelRendererCore,
  ArrayLayoutRendererCore,
  MasterListComponentCore,
  JsonFormsDetailComponentCore,
  TableRendererCore,
  GetPropsCore,
  layoutChildrenRenderPropsCore
];

export { AutocompleteControlRendererCore, BooleanControlRendererCore, DateControlRendererCore, NGFJsonFormsControl, NumberControlRendererCore, RangeControlRendererCore, TextAreaRendererCore, ToggleControlRendererCore } from './controls';
export { InputControlRendererCore } from './controls/input.renderer';
export { coreRenderers } from './coreRenderers';
export { ArrayLayoutRendererCore, CategorizationTabLayoutRendererCore, GroupLayoutRendererCore, HorizontalLayoutRendererCore, layoutChildrenRenderPropsCore, VerticalLayoutRendererCore } from './layouts';
export { GetPropsCore, JsonFormsDetailComponentCore, LabelRendererCore, MasterListComponentCore, ObjectControlRendererCore, TableRendererCore } from './other';


