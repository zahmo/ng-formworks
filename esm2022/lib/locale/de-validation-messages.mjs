export const deValidationMessages = {
    required: 'Darf nicht leer sein',
    minLength: 'Mindestens {{minimumLength}} Zeichen benötigt (aktuell: {{currentLength}})',
    maxLength: 'Maximal {{maximumLength}} Zeichen erlaubt (aktuell: {{currentLength}})',
    pattern: 'Entspricht nicht diesem regulären Ausdruck: {{requiredPattern}}',
    format: function (error) {
        switch (error.requiredFormat) {
            case 'date':
                return 'Muss ein Datum sein, z. B. "2000-12-31"';
            case 'time':
                return 'Muss eine Zeitangabe sein, z. B. "16:20" oder "03:14:15.9265"';
            case 'date-time':
                return 'Muss Datum mit Zeit beinhalten, z. B. "2000-03-14T01:59" oder "2000-03-14T01:59:26.535Z"';
            case 'email':
                return 'Keine gültige E-Mail-Adresse (z. B. "name@example.com")';
            case 'hostname':
                return 'Kein gültiger Hostname (z. B. "example.com")';
            case 'ipv4':
                return 'Keine gültige IPv4-Adresse (z. B. "127.0.0.1")';
            case 'ipv6':
                return 'Keine gültige IPv6-Adresse (z. B. "1234:5678:9ABC:DEF0:1234:5678:9ABC:DEF0")';
            // TODO: add examples for 'uri', 'uri-reference', and 'uri-template'
            // case 'uri': case 'uri-reference': case 'uri-template':
            case 'url':
                return 'Keine gültige URL (z. B. "http://www.example.com/page.html")';
            case 'uuid':
                return 'Keine gültige UUID (z. B. "12345678-9ABC-DEF0-1234-56789ABCDEF0")';
            case 'color':
                return 'Kein gültiger Farbwert (z. B. "#FFFFFF" oder "rgb(255, 255, 255)")';
            case 'json-pointer':
                return 'Kein gültiger JSON-Pointer (z. B. "/pointer/to/something")';
            case 'relative-json-pointer':
                return 'Kein gültiger relativer JSON-Pointer (z. B. "2/pointer/to/something")';
            case 'regex':
                return 'Kein gültiger regulärer Ausdruck (z. B. "(1-)?\\d{3}-\\d{3}-\\d{4}")';
            default:
                return 'Muss diesem Format entsprechen: ' + error.requiredFormat;
        }
    },
    minimum: 'Muss mindestens {{minimumValue}} sein',
    exclusiveMinimum: 'Muss größer als {{exclusiveMinimumValue}} sein',
    maximum: 'Darf maximal {{maximumValue}} sein',
    exclusiveMaximum: 'Muss kleiner als {{exclusiveMaximumValue}} sein',
    multipleOf: function (error) {
        if ((1 / error.multipleOfValue) % 10 === 0) {
            const decimals = Math.log10(1 / error.multipleOfValue);
            return `Maximal ${decimals} Dezimalstellen erlaubt`;
        }
        else {
            return `Muss ein Vielfaches von ${error.multipleOfValue} sein`;
        }
    },
    minProperties: 'Mindestens {{minimumProperties}} Attribute erforderlich (aktuell: {{currentProperties}})',
    maxProperties: 'Maximal {{maximumProperties}} Attribute erlaubt (aktuell: {{currentProperties}})',
    minItems: 'Mindestens {{minimumItems}} Werte erforderlich (aktuell: {{currentItems}})',
    maxItems: 'Maximal {{maximumItems}} Werte erlaubt (aktuell: {{currentItems}})',
    uniqueItems: 'Alle Werte müssen eindeutig sein',
    // Note: No default error messages for 'type', 'const', 'enum', or 'dependencies'
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGUtdmFsaWRhdGlvbi1tZXNzYWdlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nLWZvcm13b3Jrcy1jb3JlL3NyYy9saWIvbG9jYWxlL2RlLXZhbGlkYXRpb24tbWVzc2FnZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE1BQU0sb0JBQW9CLEdBQVE7SUFDdkMsUUFBUSxFQUFFLHNCQUFzQjtJQUNoQyxTQUFTLEVBQUUsNEVBQTRFO0lBQ3ZGLFNBQVMsRUFBRSx3RUFBd0U7SUFDbkYsT0FBTyxFQUFFLGlFQUFpRTtJQUMxRSxNQUFNLEVBQUUsVUFBVSxLQUFLO1FBQ3JCLFFBQVEsS0FBSyxDQUFDLGNBQWMsRUFBRTtZQUM1QixLQUFLLE1BQU07Z0JBQ1QsT0FBTyx5Q0FBeUMsQ0FBQztZQUNuRCxLQUFLLE1BQU07Z0JBQ1QsT0FBTywrREFBK0QsQ0FBQztZQUN6RSxLQUFLLFdBQVc7Z0JBQ2QsT0FBTywwRkFBMEYsQ0FBQztZQUNwRyxLQUFLLE9BQU87Z0JBQ1YsT0FBTyx5REFBeUQsQ0FBQztZQUNuRSxLQUFLLFVBQVU7Z0JBQ2IsT0FBTyw4Q0FBOEMsQ0FBQztZQUN4RCxLQUFLLE1BQU07Z0JBQ1QsT0FBTyxnREFBZ0QsQ0FBQztZQUMxRCxLQUFLLE1BQU07Z0JBQ1QsT0FBTyw4RUFBOEUsQ0FBQztZQUN4RixvRUFBb0U7WUFDcEUseURBQXlEO1lBQ3pELEtBQUssS0FBSztnQkFDUixPQUFPLDhEQUE4RCxDQUFDO1lBQ3hFLEtBQUssTUFBTTtnQkFDVCxPQUFPLG1FQUFtRSxDQUFDO1lBQzdFLEtBQUssT0FBTztnQkFDVixPQUFPLG9FQUFvRSxDQUFDO1lBQzlFLEtBQUssY0FBYztnQkFDakIsT0FBTyw0REFBNEQsQ0FBQztZQUN0RSxLQUFLLHVCQUF1QjtnQkFDMUIsT0FBTyx1RUFBdUUsQ0FBQztZQUNqRixLQUFLLE9BQU87Z0JBQ1YsT0FBTyxzRUFBc0UsQ0FBQztZQUNoRjtnQkFDRSxPQUFPLGtDQUFrQyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUM7U0FDcEU7SUFDSCxDQUFDO0lBQ0QsT0FBTyxFQUFFLHVDQUF1QztJQUNoRCxnQkFBZ0IsRUFBRSxnREFBZ0Q7SUFDbEUsT0FBTyxFQUFFLG9DQUFvQztJQUM3QyxnQkFBZ0IsRUFBRSxpREFBaUQ7SUFDbkUsVUFBVSxFQUFFLFVBQVUsS0FBSztRQUN6QixJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQzFDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN2RCxPQUFPLFdBQVcsUUFBUSx5QkFBeUIsQ0FBQztTQUNyRDthQUFNO1lBQ0wsT0FBTywyQkFBMkIsS0FBSyxDQUFDLGVBQWUsT0FBTyxDQUFDO1NBQ2hFO0lBQ0gsQ0FBQztJQUNELGFBQWEsRUFBRSwwRkFBMEY7SUFDekcsYUFBYSxFQUFFLGtGQUFrRjtJQUNqRyxRQUFRLEVBQUUsNEVBQTRFO0lBQ3RGLFFBQVEsRUFBRSxvRUFBb0U7SUFDOUUsV0FBVyxFQUFFLGtDQUFrQztJQUMvQyxpRkFBaUY7Q0FDbEYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBkZVZhbGlkYXRpb25NZXNzYWdlczogYW55ID0geyAvLyBEZWZhdWx0IEdlcm1hbiBlcnJvciBtZXNzYWdlc1xuICByZXF1aXJlZDogJ0RhcmYgbmljaHQgbGVlciBzZWluJyxcbiAgbWluTGVuZ3RoOiAnTWluZGVzdGVucyB7e21pbmltdW1MZW5ndGh9fSBaZWljaGVuIGJlbsO2dGlndCAoYWt0dWVsbDoge3tjdXJyZW50TGVuZ3RofX0pJyxcbiAgbWF4TGVuZ3RoOiAnTWF4aW1hbCB7e21heGltdW1MZW5ndGh9fSBaZWljaGVuIGVybGF1YnQgKGFrdHVlbGw6IHt7Y3VycmVudExlbmd0aH19KScsXG4gIHBhdHRlcm46ICdFbnRzcHJpY2h0IG5pY2h0IGRpZXNlbSByZWd1bMOkcmVuIEF1c2RydWNrOiB7e3JlcXVpcmVkUGF0dGVybn19JyxcbiAgZm9ybWF0OiBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICBzd2l0Y2ggKGVycm9yLnJlcXVpcmVkRm9ybWF0KSB7XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgcmV0dXJuICdNdXNzIGVpbiBEYXR1bSBzZWluLCB6LiBCLiBcIjIwMDAtMTItMzFcIic7XG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgcmV0dXJuICdNdXNzIGVpbmUgWmVpdGFuZ2FiZSBzZWluLCB6LiBCLiBcIjE2OjIwXCIgb2RlciBcIjAzOjE0OjE1LjkyNjVcIic7XG4gICAgICBjYXNlICdkYXRlLXRpbWUnOlxuICAgICAgICByZXR1cm4gJ011c3MgRGF0dW0gbWl0IFplaXQgYmVpbmhhbHRlbiwgei4gQi4gXCIyMDAwLTAzLTE0VDAxOjU5XCIgb2RlciBcIjIwMDAtMDMtMTRUMDE6NTk6MjYuNTM1WlwiJztcbiAgICAgIGNhc2UgJ2VtYWlsJzpcbiAgICAgICAgcmV0dXJuICdLZWluZSBnw7xsdGlnZSBFLU1haWwtQWRyZXNzZSAoei4gQi4gXCJuYW1lQGV4YW1wbGUuY29tXCIpJztcbiAgICAgIGNhc2UgJ2hvc3RuYW1lJzpcbiAgICAgICAgcmV0dXJuICdLZWluIGfDvGx0aWdlciBIb3N0bmFtZSAoei4gQi4gXCJleGFtcGxlLmNvbVwiKSc7XG4gICAgICBjYXNlICdpcHY0JzpcbiAgICAgICAgcmV0dXJuICdLZWluZSBnw7xsdGlnZSBJUHY0LUFkcmVzc2UgKHouIEIuIFwiMTI3LjAuMC4xXCIpJztcbiAgICAgIGNhc2UgJ2lwdjYnOlxuICAgICAgICByZXR1cm4gJ0tlaW5lIGfDvGx0aWdlIElQdjYtQWRyZXNzZSAoei4gQi4gXCIxMjM0OjU2Nzg6OUFCQzpERUYwOjEyMzQ6NTY3ODo5QUJDOkRFRjBcIiknO1xuICAgICAgLy8gVE9ETzogYWRkIGV4YW1wbGVzIGZvciAndXJpJywgJ3VyaS1yZWZlcmVuY2UnLCBhbmQgJ3VyaS10ZW1wbGF0ZSdcbiAgICAgIC8vIGNhc2UgJ3VyaSc6IGNhc2UgJ3VyaS1yZWZlcmVuY2UnOiBjYXNlICd1cmktdGVtcGxhdGUnOlxuICAgICAgY2FzZSAndXJsJzpcbiAgICAgICAgcmV0dXJuICdLZWluZSBnw7xsdGlnZSBVUkwgKHouIEIuIFwiaHR0cDovL3d3dy5leGFtcGxlLmNvbS9wYWdlLmh0bWxcIiknO1xuICAgICAgY2FzZSAndXVpZCc6XG4gICAgICAgIHJldHVybiAnS2VpbmUgZ8O8bHRpZ2UgVVVJRCAoei4gQi4gXCIxMjM0NTY3OC05QUJDLURFRjAtMTIzNC01Njc4OUFCQ0RFRjBcIiknO1xuICAgICAgY2FzZSAnY29sb3InOlxuICAgICAgICByZXR1cm4gJ0tlaW4gZ8O8bHRpZ2VyIEZhcmJ3ZXJ0ICh6LiBCLiBcIiNGRkZGRkZcIiBvZGVyIFwicmdiKDI1NSwgMjU1LCAyNTUpXCIpJztcbiAgICAgIGNhc2UgJ2pzb24tcG9pbnRlcic6XG4gICAgICAgIHJldHVybiAnS2VpbiBnw7xsdGlnZXIgSlNPTi1Qb2ludGVyICh6LiBCLiBcIi9wb2ludGVyL3RvL3NvbWV0aGluZ1wiKSc7XG4gICAgICBjYXNlICdyZWxhdGl2ZS1qc29uLXBvaW50ZXInOlxuICAgICAgICByZXR1cm4gJ0tlaW4gZ8O8bHRpZ2VyIHJlbGF0aXZlciBKU09OLVBvaW50ZXIgKHouIEIuIFwiMi9wb2ludGVyL3RvL3NvbWV0aGluZ1wiKSc7XG4gICAgICBjYXNlICdyZWdleCc6XG4gICAgICAgIHJldHVybiAnS2VpbiBnw7xsdGlnZXIgcmVndWzDpHJlciBBdXNkcnVjayAoei4gQi4gXCIoMS0pP1xcXFxkezN9LVxcXFxkezN9LVxcXFxkezR9XCIpJztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiAnTXVzcyBkaWVzZW0gRm9ybWF0IGVudHNwcmVjaGVuOiAnICsgZXJyb3IucmVxdWlyZWRGb3JtYXQ7XG4gICAgfVxuICB9LFxuICBtaW5pbXVtOiAnTXVzcyBtaW5kZXN0ZW5zIHt7bWluaW11bVZhbHVlfX0gc2VpbicsXG4gIGV4Y2x1c2l2ZU1pbmltdW06ICdNdXNzIGdyw7bDn2VyIGFscyB7e2V4Y2x1c2l2ZU1pbmltdW1WYWx1ZX19IHNlaW4nLFxuICBtYXhpbXVtOiAnRGFyZiBtYXhpbWFsIHt7bWF4aW11bVZhbHVlfX0gc2VpbicsXG4gIGV4Y2x1c2l2ZU1heGltdW06ICdNdXNzIGtsZWluZXIgYWxzIHt7ZXhjbHVzaXZlTWF4aW11bVZhbHVlfX0gc2VpbicsXG4gIG11bHRpcGxlT2Y6IGZ1bmN0aW9uIChlcnJvcikge1xuICAgIGlmICgoMSAvIGVycm9yLm11bHRpcGxlT2ZWYWx1ZSkgJSAxMCA9PT0gMCkge1xuICAgICAgY29uc3QgZGVjaW1hbHMgPSBNYXRoLmxvZzEwKDEgLyBlcnJvci5tdWx0aXBsZU9mVmFsdWUpO1xuICAgICAgcmV0dXJuIGBNYXhpbWFsICR7ZGVjaW1hbHN9IERlemltYWxzdGVsbGVuIGVybGF1YnRgO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYE11c3MgZWluIFZpZWxmYWNoZXMgdm9uICR7ZXJyb3IubXVsdGlwbGVPZlZhbHVlfSBzZWluYDtcbiAgICB9XG4gIH0sXG4gIG1pblByb3BlcnRpZXM6ICdNaW5kZXN0ZW5zIHt7bWluaW11bVByb3BlcnRpZXN9fSBBdHRyaWJ1dGUgZXJmb3JkZXJsaWNoIChha3R1ZWxsOiB7e2N1cnJlbnRQcm9wZXJ0aWVzfX0pJyxcbiAgbWF4UHJvcGVydGllczogJ01heGltYWwge3ttYXhpbXVtUHJvcGVydGllc319IEF0dHJpYnV0ZSBlcmxhdWJ0IChha3R1ZWxsOiB7e2N1cnJlbnRQcm9wZXJ0aWVzfX0pJyxcbiAgbWluSXRlbXM6ICdNaW5kZXN0ZW5zIHt7bWluaW11bUl0ZW1zfX0gV2VydGUgZXJmb3JkZXJsaWNoIChha3R1ZWxsOiB7e2N1cnJlbnRJdGVtc319KScsXG4gIG1heEl0ZW1zOiAnTWF4aW1hbCB7e21heGltdW1JdGVtc319IFdlcnRlIGVybGF1YnQgKGFrdHVlbGw6IHt7Y3VycmVudEl0ZW1zfX0pJyxcbiAgdW5pcXVlSXRlbXM6ICdBbGxlIFdlcnRlIG3DvHNzZW4gZWluZGV1dGlnIHNlaW4nLFxuICAvLyBOb3RlOiBObyBkZWZhdWx0IGVycm9yIG1lc3NhZ2VzIGZvciAndHlwZScsICdjb25zdCcsICdlbnVtJywgb3IgJ2RlcGVuZGVuY2llcydcbn07XG4iXX0=