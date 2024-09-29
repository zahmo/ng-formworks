export const enValidationMessages = {
    required: 'This field is required.',
    minLength: 'Must be {{minimumLength}} characters or longer (current length: {{currentLength}})',
    maxLength: 'Must be {{maximumLength}} characters or shorter (current length: {{currentLength}})',
    pattern: 'Must match pattern: {{requiredPattern}}',
    format: function (error) {
        switch (error.requiredFormat) {
            case 'date':
                return 'Must be a date, like "2000-12-31"';
            case 'time':
                return 'Must be a time, like "16:20" or "03:14:15.9265"';
            case 'date-time':
                return 'Must be a date-time, like "2000-03-14T01:59" or "2000-03-14T01:59:26.535Z"';
            case 'email':
                return 'Must be an email address, like "name@example.com"';
            case 'hostname':
                return 'Must be a hostname, like "example.com"';
            case 'ipv4':
                return 'Must be an IPv4 address, like "127.0.0.1"';
            case 'ipv6':
                return 'Must be an IPv6 address, like "1234:5678:9ABC:DEF0:1234:5678:9ABC:DEF0"';
            // TODO: add examples for 'uri', 'uri-reference', and 'uri-template'
            // case 'uri': case 'uri-reference': case 'uri-template':
            case 'url':
                return 'Must be a url, like "http://www.example.com/page.html"';
            case 'uuid':
                return 'Must be a uuid, like "12345678-9ABC-DEF0-1234-56789ABCDEF0"';
            case 'color':
                return 'Must be a color, like "#FFFFFF" or "rgb(255, 255, 255)"';
            case 'json-pointer':
                return 'Must be a JSON Pointer, like "/pointer/to/something"';
            case 'relative-json-pointer':
                return 'Must be a relative JSON Pointer, like "2/pointer/to/something"';
            case 'regex':
                return 'Must be a regular expression, like "(1-)?\\d{3}-\\d{3}-\\d{4}"';
            default:
                return 'Must be a correctly formatted ' + error.requiredFormat;
        }
    },
    minimum: 'Must be {{minimumValue}} or more',
    exclusiveMinimum: 'Must be more than {{exclusiveMinimumValue}}',
    maximum: 'Must be {{maximumValue}} or less',
    exclusiveMaximum: 'Must be less than {{exclusiveMaximumValue}}',
    multipleOf: function (error) {
        if ((1 / error.multipleOfValue) % 10 === 0) {
            const decimals = Math.log10(1 / error.multipleOfValue);
            return `Must have ${decimals} or fewer decimal places.`;
        }
        else {
            return `Must be a multiple of ${error.multipleOfValue}.`;
        }
    },
    minProperties: 'Must have {{minimumProperties}} or more items (current items: {{currentProperties}})',
    maxProperties: 'Must have {{maximumProperties}} or fewer items (current items: {{currentProperties}})',
    minItems: 'Must have {{minimumItems}} or more items (current items: {{currentItems}})',
    maxItems: 'Must have {{maximumItems}} or fewer items (current items: {{currentItems}})',
    uniqueItems: 'All items must be unique',
    // Note: No default error messages for 'type', 'const', 'enum', or 'dependencies'
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW4tdmFsaWRhdGlvbi1tZXNzYWdlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nLWZvcm13b3Jrcy1jb3JlL3NyYy9saWIvbG9jYWxlL2VuLXZhbGlkYXRpb24tbWVzc2FnZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE1BQU0sb0JBQW9CLEdBQVE7SUFDdkMsUUFBUSxFQUFFLHlCQUF5QjtJQUNuQyxTQUFTLEVBQUUsb0ZBQW9GO0lBQy9GLFNBQVMsRUFBRSxxRkFBcUY7SUFDaEcsT0FBTyxFQUFFLHlDQUF5QztJQUNsRCxNQUFNLEVBQUUsVUFBVSxLQUFLO1FBQ3JCLFFBQVEsS0FBSyxDQUFDLGNBQWMsRUFBRTtZQUM1QixLQUFLLE1BQU07Z0JBQ1QsT0FBTyxtQ0FBbUMsQ0FBQztZQUM3QyxLQUFLLE1BQU07Z0JBQ1QsT0FBTyxpREFBaUQsQ0FBQztZQUMzRCxLQUFLLFdBQVc7Z0JBQ2QsT0FBTyw0RUFBNEUsQ0FBQztZQUN0RixLQUFLLE9BQU87Z0JBQ1YsT0FBTyxtREFBbUQsQ0FBQztZQUM3RCxLQUFLLFVBQVU7Z0JBQ2IsT0FBTyx3Q0FBd0MsQ0FBQztZQUNsRCxLQUFLLE1BQU07Z0JBQ1QsT0FBTywyQ0FBMkMsQ0FBQztZQUNyRCxLQUFLLE1BQU07Z0JBQ1QsT0FBTyx5RUFBeUUsQ0FBQztZQUNuRixvRUFBb0U7WUFDcEUseURBQXlEO1lBQ3pELEtBQUssS0FBSztnQkFDUixPQUFPLHdEQUF3RCxDQUFDO1lBQ2xFLEtBQUssTUFBTTtnQkFDVCxPQUFPLDZEQUE2RCxDQUFDO1lBQ3ZFLEtBQUssT0FBTztnQkFDVixPQUFPLHlEQUF5RCxDQUFDO1lBQ25FLEtBQUssY0FBYztnQkFDakIsT0FBTyxzREFBc0QsQ0FBQztZQUNoRSxLQUFLLHVCQUF1QjtnQkFDMUIsT0FBTyxnRUFBZ0UsQ0FBQztZQUMxRSxLQUFLLE9BQU87Z0JBQ1YsT0FBTyxnRUFBZ0UsQ0FBQztZQUMxRTtnQkFDRSxPQUFPLGdDQUFnQyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUM7U0FDbEU7SUFDSCxDQUFDO0lBQ0QsT0FBTyxFQUFFLGtDQUFrQztJQUMzQyxnQkFBZ0IsRUFBRSw2Q0FBNkM7SUFDL0QsT0FBTyxFQUFFLGtDQUFrQztJQUMzQyxnQkFBZ0IsRUFBRSw2Q0FBNkM7SUFDL0QsVUFBVSxFQUFFLFVBQVUsS0FBSztRQUN6QixJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQzFDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN2RCxPQUFPLGFBQWEsUUFBUSwyQkFBMkIsQ0FBQztTQUN6RDthQUFNO1lBQ0wsT0FBTyx5QkFBeUIsS0FBSyxDQUFDLGVBQWUsR0FBRyxDQUFDO1NBQzFEO0lBQ0gsQ0FBQztJQUNELGFBQWEsRUFBRSxzRkFBc0Y7SUFDckcsYUFBYSxFQUFFLHVGQUF1RjtJQUN0RyxRQUFRLEVBQUUsNEVBQTRFO0lBQ3RGLFFBQVEsRUFBRSw2RUFBNkU7SUFDdkYsV0FBVyxFQUFFLDBCQUEwQjtJQUN2QyxpRkFBaUY7Q0FDbEYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBlblZhbGlkYXRpb25NZXNzYWdlczogYW55ID0geyAvLyBEZWZhdWx0IEVuZ2xpc2ggZXJyb3IgbWVzc2FnZXNcbiAgcmVxdWlyZWQ6ICdUaGlzIGZpZWxkIGlzIHJlcXVpcmVkLicsXG4gIG1pbkxlbmd0aDogJ011c3QgYmUge3ttaW5pbXVtTGVuZ3RofX0gY2hhcmFjdGVycyBvciBsb25nZXIgKGN1cnJlbnQgbGVuZ3RoOiB7e2N1cnJlbnRMZW5ndGh9fSknLFxuICBtYXhMZW5ndGg6ICdNdXN0IGJlIHt7bWF4aW11bUxlbmd0aH19IGNoYXJhY3RlcnMgb3Igc2hvcnRlciAoY3VycmVudCBsZW5ndGg6IHt7Y3VycmVudExlbmd0aH19KScsXG4gIHBhdHRlcm46ICdNdXN0IG1hdGNoIHBhdHRlcm46IHt7cmVxdWlyZWRQYXR0ZXJufX0nLFxuICBmb3JtYXQ6IGZ1bmN0aW9uIChlcnJvcikge1xuICAgIHN3aXRjaCAoZXJyb3IucmVxdWlyZWRGb3JtYXQpIHtcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICByZXR1cm4gJ011c3QgYmUgYSBkYXRlLCBsaWtlIFwiMjAwMC0xMi0zMVwiJztcbiAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICByZXR1cm4gJ011c3QgYmUgYSB0aW1lLCBsaWtlIFwiMTY6MjBcIiBvciBcIjAzOjE0OjE1LjkyNjVcIic7XG4gICAgICBjYXNlICdkYXRlLXRpbWUnOlxuICAgICAgICByZXR1cm4gJ011c3QgYmUgYSBkYXRlLXRpbWUsIGxpa2UgXCIyMDAwLTAzLTE0VDAxOjU5XCIgb3IgXCIyMDAwLTAzLTE0VDAxOjU5OjI2LjUzNVpcIic7XG4gICAgICBjYXNlICdlbWFpbCc6XG4gICAgICAgIHJldHVybiAnTXVzdCBiZSBhbiBlbWFpbCBhZGRyZXNzLCBsaWtlIFwibmFtZUBleGFtcGxlLmNvbVwiJztcbiAgICAgIGNhc2UgJ2hvc3RuYW1lJzpcbiAgICAgICAgcmV0dXJuICdNdXN0IGJlIGEgaG9zdG5hbWUsIGxpa2UgXCJleGFtcGxlLmNvbVwiJztcbiAgICAgIGNhc2UgJ2lwdjQnOlxuICAgICAgICByZXR1cm4gJ011c3QgYmUgYW4gSVB2NCBhZGRyZXNzLCBsaWtlIFwiMTI3LjAuMC4xXCInO1xuICAgICAgY2FzZSAnaXB2Nic6XG4gICAgICAgIHJldHVybiAnTXVzdCBiZSBhbiBJUHY2IGFkZHJlc3MsIGxpa2UgXCIxMjM0OjU2Nzg6OUFCQzpERUYwOjEyMzQ6NTY3ODo5QUJDOkRFRjBcIic7XG4gICAgICAvLyBUT0RPOiBhZGQgZXhhbXBsZXMgZm9yICd1cmknLCAndXJpLXJlZmVyZW5jZScsIGFuZCAndXJpLXRlbXBsYXRlJ1xuICAgICAgLy8gY2FzZSAndXJpJzogY2FzZSAndXJpLXJlZmVyZW5jZSc6IGNhc2UgJ3VyaS10ZW1wbGF0ZSc6XG4gICAgICBjYXNlICd1cmwnOlxuICAgICAgICByZXR1cm4gJ011c3QgYmUgYSB1cmwsIGxpa2UgXCJodHRwOi8vd3d3LmV4YW1wbGUuY29tL3BhZ2UuaHRtbFwiJztcbiAgICAgIGNhc2UgJ3V1aWQnOlxuICAgICAgICByZXR1cm4gJ011c3QgYmUgYSB1dWlkLCBsaWtlIFwiMTIzNDU2NzgtOUFCQy1ERUYwLTEyMzQtNTY3ODlBQkNERUYwXCInO1xuICAgICAgY2FzZSAnY29sb3InOlxuICAgICAgICByZXR1cm4gJ011c3QgYmUgYSBjb2xvciwgbGlrZSBcIiNGRkZGRkZcIiBvciBcInJnYigyNTUsIDI1NSwgMjU1KVwiJztcbiAgICAgIGNhc2UgJ2pzb24tcG9pbnRlcic6XG4gICAgICAgIHJldHVybiAnTXVzdCBiZSBhIEpTT04gUG9pbnRlciwgbGlrZSBcIi9wb2ludGVyL3RvL3NvbWV0aGluZ1wiJztcbiAgICAgIGNhc2UgJ3JlbGF0aXZlLWpzb24tcG9pbnRlcic6XG4gICAgICAgIHJldHVybiAnTXVzdCBiZSBhIHJlbGF0aXZlIEpTT04gUG9pbnRlciwgbGlrZSBcIjIvcG9pbnRlci90by9zb21ldGhpbmdcIic7XG4gICAgICBjYXNlICdyZWdleCc6XG4gICAgICAgIHJldHVybiAnTXVzdCBiZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbiwgbGlrZSBcIigxLSk/XFxcXGR7M30tXFxcXGR7M30tXFxcXGR7NH1cIic7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gJ011c3QgYmUgYSBjb3JyZWN0bHkgZm9ybWF0dGVkICcgKyBlcnJvci5yZXF1aXJlZEZvcm1hdDtcbiAgICB9XG4gIH0sXG4gIG1pbmltdW06ICdNdXN0IGJlIHt7bWluaW11bVZhbHVlfX0gb3IgbW9yZScsXG4gIGV4Y2x1c2l2ZU1pbmltdW06ICdNdXN0IGJlIG1vcmUgdGhhbiB7e2V4Y2x1c2l2ZU1pbmltdW1WYWx1ZX19JyxcbiAgbWF4aW11bTogJ011c3QgYmUge3ttYXhpbXVtVmFsdWV9fSBvciBsZXNzJyxcbiAgZXhjbHVzaXZlTWF4aW11bTogJ011c3QgYmUgbGVzcyB0aGFuIHt7ZXhjbHVzaXZlTWF4aW11bVZhbHVlfX0nLFxuICBtdWx0aXBsZU9mOiBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICBpZiAoKDEgLyBlcnJvci5tdWx0aXBsZU9mVmFsdWUpICUgMTAgPT09IDApIHtcbiAgICAgIGNvbnN0IGRlY2ltYWxzID0gTWF0aC5sb2cxMCgxIC8gZXJyb3IubXVsdGlwbGVPZlZhbHVlKTtcbiAgICAgIHJldHVybiBgTXVzdCBoYXZlICR7ZGVjaW1hbHN9IG9yIGZld2VyIGRlY2ltYWwgcGxhY2VzLmA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgTXVzdCBiZSBhIG11bHRpcGxlIG9mICR7ZXJyb3IubXVsdGlwbGVPZlZhbHVlfS5gO1xuICAgIH1cbiAgfSxcbiAgbWluUHJvcGVydGllczogJ011c3QgaGF2ZSB7e21pbmltdW1Qcm9wZXJ0aWVzfX0gb3IgbW9yZSBpdGVtcyAoY3VycmVudCBpdGVtczoge3tjdXJyZW50UHJvcGVydGllc319KScsXG4gIG1heFByb3BlcnRpZXM6ICdNdXN0IGhhdmUge3ttYXhpbXVtUHJvcGVydGllc319IG9yIGZld2VyIGl0ZW1zIChjdXJyZW50IGl0ZW1zOiB7e2N1cnJlbnRQcm9wZXJ0aWVzfX0pJyxcbiAgbWluSXRlbXM6ICdNdXN0IGhhdmUge3ttaW5pbXVtSXRlbXN9fSBvciBtb3JlIGl0ZW1zIChjdXJyZW50IGl0ZW1zOiB7e2N1cnJlbnRJdGVtc319KScsXG4gIG1heEl0ZW1zOiAnTXVzdCBoYXZlIHt7bWF4aW11bUl0ZW1zfX0gb3IgZmV3ZXIgaXRlbXMgKGN1cnJlbnQgaXRlbXM6IHt7Y3VycmVudEl0ZW1zfX0pJyxcbiAgdW5pcXVlSXRlbXM6ICdBbGwgaXRlbXMgbXVzdCBiZSB1bmlxdWUnLFxuICAvLyBOb3RlOiBObyBkZWZhdWx0IGVycm9yIG1lc3NhZ2VzIGZvciAndHlwZScsICdjb25zdCcsICdlbnVtJywgb3IgJ2RlcGVuZGVuY2llcydcbn07XG4iXX0=