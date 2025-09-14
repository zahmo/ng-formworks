import { UntypedFormGroup } from '@angular/forms';
import { JsonSchemaFormService, WidgetContext } from './json-schema-form.service';

class TestableJsonSchemaFormService extends JsonSchemaFormService {
	constructor() {
		super();
		this.formGroup = new UntypedFormGroup({});
	}
}

function makeCtx({ options = {}, layoutNode = {} as any, dataIndex = [0], layoutIndex = [0] }: any): any {
	const ln = { name: 'field', ...layoutNode };
	return {
		options,
		layoutNode: () => ln,
		dataIndex: () => dataIndex,
		layoutIndex: () => layoutIndex,
	} as unknown as WidgetContext;
}

describe('JsonSchemaFormService.initializeControl null-safety', () => {
	let service: TestableJsonSchemaFormService;

	beforeEach(() => {
		service = new TestableJsonSchemaFormService();
		(service as any).formOptions = { defaultWidgetOptions: {}, validateOnRender: 'auto' };
		(service as any).data = {};
		(service as any).formValues = undefined;
		(service as any).dataMap = new Map<string, Map<string, any>>();
	});

	it('does not throw when conditional branch runs without a bound control', () => {
		// Arrange: no dataPointer -> getFormControl returns null in real service
		// Trigger conditional branch via oneOfPointer
		const ctx = makeCtx({
			layoutNode: { name: 'section-like', oneOfPointer: '/schema/oneOf' },
			options: { default: 0, condition: false },
		});

		// Act & Assert: Expect NOT to throw. CURRENTLY this will throw due to ctx.formControl.value access.
		expect(() => service.initializeControl(ctx)).not.toThrow();
	});
});
