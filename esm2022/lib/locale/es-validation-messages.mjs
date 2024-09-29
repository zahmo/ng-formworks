export const esValidationMessages = {
    required: 'Este campo está requerido.',
    minLength: 'Debe tener {{minimumLength}} caracteres o más longitud (longitud actual: {{currentLength}})',
    maxLength: 'Debe tener {{maximumLength}} caracteres o menos longitud (longitud actual: {{currentLength}})',
    pattern: 'Must match pattern: {{requiredPattern}}',
    format: function (error) {
        switch (error.requiredFormat) {
            case 'date':
                return 'Debe tener una fecha, ej "2000-12-31"';
            case 'time':
                return 'Debe tener una hora, ej "16:20" o "03:14:15.9265"';
            case 'date-time':
                return 'Debe tener fecha y hora, ej "2000-03-14T01:59" o "2000-03-14T01:59:26.535Z"';
            case 'email':
                return 'No hay dirección de correo electrónico válida, ej "name@example.com"';
            case 'hostname':
                return 'Debe ser un nombre de host válido, ej "example.com"';
            case 'ipv4':
                return 'Debe ser una dirección de IPv4, ej "127.0.0.1"';
            case 'ipv6':
                return 'Debe ser una dirección de IPv6, ej "1234:5678:9ABC:DEF0:1234:5678:9ABC:DEF0"';
            case 'url':
                return 'Debe ser una URL, ej "http://www.example.com/page.html"';
            case 'uuid':
                return 'Debe ser un UUID, ej "12345678-9ABC-DEF0-1234-56789ABCDEF0"';
            case 'color':
                return 'Debe ser un color, ej "#FFFFFF" or "rgb(255, 255, 255)"';
            case 'json-pointer':
                return 'Debe ser un JSON Pointer, ej "/pointer/to/something"';
            case 'relative-json-pointer':
                return 'Debe ser un JSON Pointer relativo, ej "2/pointer/to/something"';
            case 'regex':
                return 'Debe ser una expresión regular, ej "(1-)?\\d{3}-\\d{3}-\\d{4}"';
            default:
                return 'Debe tener el formato correcto ' + error.requiredFormat;
        }
    },
    minimum: 'Debe ser {{minimumValue}} o más',
    exclusiveMinimum: 'Debe ser superior a {{exclusiveMinimumValue}}',
    maximum: 'Debe ser {{maximumValue}} o menos',
    exclusiveMaximum: 'Debe ser menor que {{exclusiveMaximumValue}}',
    multipleOf: function (error) {
        if ((1 / error.multipleOfValue) % 10 === 0) {
            const decimals = Math.log10(1 / error.multipleOfValue);
            return `Se permite un máximo de ${decimals} decimales`;
        }
        else {
            return `Debe ser múltiplo de ${error.multipleOfValue}.`;
        }
    },
    minProperties: 'Debe tener {{minimumProperties}} o más elementos (elementos actuales: {{currentProperties}})',
    maxProperties: 'Debe tener {{maximumProperties}} o menos elementos (elementos actuales: {{currentProperties}})',
    minItems: 'Debe tener {{minimumItems}} o más elementos (elementos actuales: {{currentItems}})',
    maxItems: 'Debe tener {{maximumItems}} o menos elementos (elementos actuales: {{currentItems}})',
    uniqueItems: 'Todos los elementos deben ser únicos',
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXMtdmFsaWRhdGlvbi1tZXNzYWdlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nLWZvcm13b3Jrcy1jb3JlL3NyYy9saWIvbG9jYWxlL2VzLXZhbGlkYXRpb24tbWVzc2FnZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE1BQU0sb0JBQW9CLEdBQVE7SUFDdkMsUUFBUSxFQUFFLDRCQUE0QjtJQUN0QyxTQUFTLEVBQUUsNkZBQTZGO0lBQ3hHLFNBQVMsRUFBRSwrRkFBK0Y7SUFDMUcsT0FBTyxFQUFFLHlDQUF5QztJQUNsRCxNQUFNLEVBQUUsVUFBVSxLQUFLO1FBQ3JCLFFBQVEsS0FBSyxDQUFDLGNBQWMsRUFBRTtZQUM1QixLQUFLLE1BQU07Z0JBQ1QsT0FBTyx1Q0FBdUMsQ0FBQztZQUNqRCxLQUFLLE1BQU07Z0JBQ1QsT0FBTyxtREFBbUQsQ0FBQztZQUM3RCxLQUFLLFdBQVc7Z0JBQ2QsT0FBTyw2RUFBNkUsQ0FBQztZQUN2RixLQUFLLE9BQU87Z0JBQ1YsT0FBTyxzRUFBc0UsQ0FBQztZQUNoRixLQUFLLFVBQVU7Z0JBQ2IsT0FBTyxxREFBcUQsQ0FBQztZQUMvRCxLQUFLLE1BQU07Z0JBQ1QsT0FBTyxnREFBZ0QsQ0FBQztZQUMxRCxLQUFLLE1BQU07Z0JBQ1QsT0FBTyw4RUFBOEUsQ0FBQztZQUN4RixLQUFLLEtBQUs7Z0JBQ1IsT0FBTyx5REFBeUQsQ0FBQztZQUNuRSxLQUFLLE1BQU07Z0JBQ1QsT0FBTyw2REFBNkQsQ0FBQztZQUN2RSxLQUFLLE9BQU87Z0JBQ1YsT0FBTyx5REFBeUQsQ0FBQztZQUNuRSxLQUFLLGNBQWM7Z0JBQ2pCLE9BQU8sc0RBQXNELENBQUM7WUFDaEUsS0FBSyx1QkFBdUI7Z0JBQzFCLE9BQU8sZ0VBQWdFLENBQUM7WUFDMUUsS0FBSyxPQUFPO2dCQUNWLE9BQU8sZ0VBQWdFLENBQUM7WUFDMUU7Z0JBQ0UsT0FBTyxpQ0FBaUMsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDO1NBQ25FO0lBQ0gsQ0FBQztJQUNELE9BQU8sRUFBRSxpQ0FBaUM7SUFDMUMsZ0JBQWdCLEVBQUUsK0NBQStDO0lBQ2pFLE9BQU8sRUFBRSxtQ0FBbUM7SUFDNUMsZ0JBQWdCLEVBQUUsOENBQThDO0lBQ2hFLFVBQVUsRUFBRSxVQUFVLEtBQUs7UUFDekIsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRTtZQUMxQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDdkQsT0FBTywyQkFBMkIsUUFBUSxZQUFZLENBQUM7U0FDeEQ7YUFBTTtZQUNMLE9BQU8sd0JBQXdCLEtBQUssQ0FBQyxlQUFlLEdBQUcsQ0FBQztTQUN6RDtJQUNILENBQUM7SUFDRCxhQUFhLEVBQUUsOEZBQThGO0lBQzdHLGFBQWEsRUFBRSxnR0FBZ0c7SUFDL0csUUFBUSxFQUFFLG9GQUFvRjtJQUM5RixRQUFRLEVBQUUsc0ZBQXNGO0lBQ2hHLFdBQVcsRUFBRSxzQ0FBc0M7Q0FDcEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBlc1ZhbGlkYXRpb25NZXNzYWdlczogYW55ID0geyAvLyBEZWZhdWx0IFNwYW5pc2ggZXJyb3IgbWVzc2FnZXNcbiAgcmVxdWlyZWQ6ICdFc3RlIGNhbXBvIGVzdMOhIHJlcXVlcmlkby4nLFxuICBtaW5MZW5ndGg6ICdEZWJlIHRlbmVyIHt7bWluaW11bUxlbmd0aH19IGNhcmFjdGVyZXMgbyBtw6FzIGxvbmdpdHVkIChsb25naXR1ZCBhY3R1YWw6IHt7Y3VycmVudExlbmd0aH19KScsXG4gIG1heExlbmd0aDogJ0RlYmUgdGVuZXIge3ttYXhpbXVtTGVuZ3RofX0gY2FyYWN0ZXJlcyBvIG1lbm9zIGxvbmdpdHVkIChsb25naXR1ZCBhY3R1YWw6IHt7Y3VycmVudExlbmd0aH19KScsXG4gIHBhdHRlcm46ICdNdXN0IG1hdGNoIHBhdHRlcm46IHt7cmVxdWlyZWRQYXR0ZXJufX0nLFxuICBmb3JtYXQ6IGZ1bmN0aW9uIChlcnJvcikge1xuICAgIHN3aXRjaCAoZXJyb3IucmVxdWlyZWRGb3JtYXQpIHtcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICByZXR1cm4gJ0RlYmUgdGVuZXIgdW5hIGZlY2hhLCBlaiBcIjIwMDAtMTItMzFcIic7XG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgcmV0dXJuICdEZWJlIHRlbmVyIHVuYSBob3JhLCBlaiBcIjE2OjIwXCIgbyBcIjAzOjE0OjE1LjkyNjVcIic7XG4gICAgICBjYXNlICdkYXRlLXRpbWUnOlxuICAgICAgICByZXR1cm4gJ0RlYmUgdGVuZXIgZmVjaGEgeSBob3JhLCBlaiBcIjIwMDAtMDMtMTRUMDE6NTlcIiBvIFwiMjAwMC0wMy0xNFQwMTo1OToyNi41MzVaXCInO1xuICAgICAgY2FzZSAnZW1haWwnOlxuICAgICAgICByZXR1cm4gJ05vIGhheSBkaXJlY2Npw7NuIGRlIGNvcnJlbyBlbGVjdHLDs25pY28gdsOhbGlkYSwgZWogXCJuYW1lQGV4YW1wbGUuY29tXCInO1xuICAgICAgY2FzZSAnaG9zdG5hbWUnOlxuICAgICAgICByZXR1cm4gJ0RlYmUgc2VyIHVuIG5vbWJyZSBkZSBob3N0IHbDoWxpZG8sIGVqIFwiZXhhbXBsZS5jb21cIic7XG4gICAgICBjYXNlICdpcHY0JzpcbiAgICAgICAgcmV0dXJuICdEZWJlIHNlciB1bmEgZGlyZWNjacOzbiBkZSBJUHY0LCBlaiBcIjEyNy4wLjAuMVwiJztcbiAgICAgIGNhc2UgJ2lwdjYnOlxuICAgICAgICByZXR1cm4gJ0RlYmUgc2VyIHVuYSBkaXJlY2Npw7NuIGRlIElQdjYsIGVqIFwiMTIzNDo1Njc4OjlBQkM6REVGMDoxMjM0OjU2Nzg6OUFCQzpERUYwXCInO1xuICAgICAgY2FzZSAndXJsJzpcbiAgICAgICAgcmV0dXJuICdEZWJlIHNlciB1bmEgVVJMLCBlaiBcImh0dHA6Ly93d3cuZXhhbXBsZS5jb20vcGFnZS5odG1sXCInO1xuICAgICAgY2FzZSAndXVpZCc6XG4gICAgICAgIHJldHVybiAnRGViZSBzZXIgdW4gVVVJRCwgZWogXCIxMjM0NTY3OC05QUJDLURFRjAtMTIzNC01Njc4OUFCQ0RFRjBcIic7XG4gICAgICBjYXNlICdjb2xvcic6XG4gICAgICAgIHJldHVybiAnRGViZSBzZXIgdW4gY29sb3IsIGVqIFwiI0ZGRkZGRlwiIG9yIFwicmdiKDI1NSwgMjU1LCAyNTUpXCInO1xuICAgICAgY2FzZSAnanNvbi1wb2ludGVyJzpcbiAgICAgICAgcmV0dXJuICdEZWJlIHNlciB1biBKU09OIFBvaW50ZXIsIGVqIFwiL3BvaW50ZXIvdG8vc29tZXRoaW5nXCInO1xuICAgICAgY2FzZSAncmVsYXRpdmUtanNvbi1wb2ludGVyJzpcbiAgICAgICAgcmV0dXJuICdEZWJlIHNlciB1biBKU09OIFBvaW50ZXIgcmVsYXRpdm8sIGVqIFwiMi9wb2ludGVyL3RvL3NvbWV0aGluZ1wiJztcbiAgICAgIGNhc2UgJ3JlZ2V4JzpcbiAgICAgICAgcmV0dXJuICdEZWJlIHNlciB1bmEgZXhwcmVzacOzbiByZWd1bGFyLCBlaiBcIigxLSk/XFxcXGR7M30tXFxcXGR7M30tXFxcXGR7NH1cIic7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gJ0RlYmUgdGVuZXIgZWwgZm9ybWF0byBjb3JyZWN0byAnICsgZXJyb3IucmVxdWlyZWRGb3JtYXQ7XG4gICAgfVxuICB9LFxuICBtaW5pbXVtOiAnRGViZSBzZXIge3ttaW5pbXVtVmFsdWV9fSBvIG3DoXMnLFxuICBleGNsdXNpdmVNaW5pbXVtOiAnRGViZSBzZXIgc3VwZXJpb3IgYSB7e2V4Y2x1c2l2ZU1pbmltdW1WYWx1ZX19JyxcbiAgbWF4aW11bTogJ0RlYmUgc2VyIHt7bWF4aW11bVZhbHVlfX0gbyBtZW5vcycsXG4gIGV4Y2x1c2l2ZU1heGltdW06ICdEZWJlIHNlciBtZW5vciBxdWUge3tleGNsdXNpdmVNYXhpbXVtVmFsdWV9fScsXG4gIG11bHRpcGxlT2Y6IGZ1bmN0aW9uIChlcnJvcikge1xuICAgIGlmICgoMSAvIGVycm9yLm11bHRpcGxlT2ZWYWx1ZSkgJSAxMCA9PT0gMCkge1xuICAgICAgY29uc3QgZGVjaW1hbHMgPSBNYXRoLmxvZzEwKDEgLyBlcnJvci5tdWx0aXBsZU9mVmFsdWUpO1xuICAgICAgcmV0dXJuIGBTZSBwZXJtaXRlIHVuIG3DoXhpbW8gZGUgJHtkZWNpbWFsc30gZGVjaW1hbGVzYDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGBEZWJlIHNlciBtw7psdGlwbG8gZGUgJHtlcnJvci5tdWx0aXBsZU9mVmFsdWV9LmA7XG4gICAgfVxuICB9LFxuICBtaW5Qcm9wZXJ0aWVzOiAnRGViZSB0ZW5lciB7e21pbmltdW1Qcm9wZXJ0aWVzfX0gbyBtw6FzIGVsZW1lbnRvcyAoZWxlbWVudG9zIGFjdHVhbGVzOiB7e2N1cnJlbnRQcm9wZXJ0aWVzfX0pJyxcbiAgbWF4UHJvcGVydGllczogJ0RlYmUgdGVuZXIge3ttYXhpbXVtUHJvcGVydGllc319IG8gbWVub3MgZWxlbWVudG9zIChlbGVtZW50b3MgYWN0dWFsZXM6IHt7Y3VycmVudFByb3BlcnRpZXN9fSknLFxuICBtaW5JdGVtczogJ0RlYmUgdGVuZXIge3ttaW5pbXVtSXRlbXN9fSBvIG3DoXMgZWxlbWVudG9zIChlbGVtZW50b3MgYWN0dWFsZXM6IHt7Y3VycmVudEl0ZW1zfX0pJyxcbiAgbWF4SXRlbXM6ICdEZWJlIHRlbmVyIHt7bWF4aW11bUl0ZW1zfX0gbyBtZW5vcyBlbGVtZW50b3MgKGVsZW1lbnRvcyBhY3R1YWxlczoge3tjdXJyZW50SXRlbXN9fSknLFxuICB1bmlxdWVJdGVtczogJ1RvZG9zIGxvcyBlbGVtZW50b3MgZGViZW4gc2VyIMO6bmljb3MnLFxufTtcbiJdfQ==