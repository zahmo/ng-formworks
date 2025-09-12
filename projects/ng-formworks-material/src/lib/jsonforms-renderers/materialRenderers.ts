import { angularMaterialRenderers } from "@jsonforms/angular-material";
import { isOneOfControl, RankedTester, rankWith } from "@jsonforms/core";
import { MaterialOneOfRendererComponent } from "./complex/material-one-of-renderer/material-one-of-renderer";

export const materialRenderers: {
    tester: RankedTester;
    renderer: any;
  }[] = [
      ...angularMaterialRenderers,
      { tester: rankWith(3, isOneOfControl), renderer: MaterialOneOfRendererComponent },
    ];