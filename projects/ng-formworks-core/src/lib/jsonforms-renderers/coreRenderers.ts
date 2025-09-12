import { isEnumControl, isMultiLineControl, isOneOfControl, isStringControl, or, RankedTester, rankWith, schemaMatches } from "@jsonforms/core";
import { AutocompleteControlRendererCore, BooleanControlRendererCore, booleanControlTester, DateControlRendererCore, DateControlRendererCoreTester, NumberControlRendererCore, NumberControlRendererCoreTester, RangeControlRendererCore, RangeControlRendererCoreTester, TextAreaRendererCore, ToggleControlRendererCore, ToggleControlRendererCoreTester } from "./controls";
import { InputControlRendererCore } from "./controls/input.renderer";
import { ArrayLayoutRendererCore, ArrayLayoutRendererCoreTester, CategorizationTabLayoutRendererCore, categorizationTester, GroupLayoutRendererCore, groupLayoutTester, HorizontalLayoutRendererCore, horizontalLayoutTester, VerticalLayoutRendererCore, verticalLayoutTester } from "./layouts";
import { LabelRendererCore, LabelRendererCoreTester, masterDetailTester, MasterListComponentCore, ObjectControlRendererCore, ObjectControlRendererCoreTester, TableRendererCore, TableRendererCoreTester } from "./other";

export const coreRenderers: {
    tester: RankedTester;
    renderer: any;
  }[] = [
    {
        renderer:InputControlRendererCore,

        tester: rankWith(

          2,isStringControl
          /*
          and(
            isControl,
            schemaTypeIs('string')
          )
            */
        )
        
      },
      { tester: booleanControlTester, renderer: BooleanControlRendererCore },
      //taken care of by InputControlRendererCore
      //{ tester: TextControlRendererTester, renderer: TextControlRenderer },
      { tester: rankWith(3,or(isMultiLineControl,schemaMatches((schema) => schema?.["options"]?.multi))), renderer: TextAreaRendererCore },
      { tester: NumberControlRendererCoreTester, renderer: NumberControlRendererCore },
      { tester: RangeControlRendererCoreTester, renderer: RangeControlRendererCore },
      { tester: DateControlRendererCoreTester, renderer: DateControlRendererCore },
      { tester: ToggleControlRendererCoreTester, renderer: ToggleControlRendererCore },
      { tester: rankWith(3, isEnumControl), renderer: AutocompleteControlRendererCore },
      { tester: ObjectControlRendererCoreTester, renderer: ObjectControlRendererCore },
      // layouts
      { tester: verticalLayoutTester, renderer: VerticalLayoutRendererCore },
      { tester: groupLayoutTester, renderer: GroupLayoutRendererCore },
      { tester: horizontalLayoutTester, renderer: HorizontalLayoutRendererCore },
      { tester: categorizationTester, renderer: CategorizationTabLayoutRendererCore },
      { tester: rankWith(3, isOneOfControl), renderer: CategorizationTabLayoutRendererCore },
      { tester: LabelRendererCoreTester, renderer: LabelRendererCore },
      { tester: ArrayLayoutRendererCoreTester, renderer: ArrayLayoutRendererCore },
      // other
      { tester: masterDetailTester, renderer: MasterListComponentCore },
      { tester: TableRendererCoreTester, renderer: TableRendererCore },
  ];