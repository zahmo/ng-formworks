export const frValidationMessages = {
    required: 'Est obligatoire.',
    minLength: 'Doit avoir minimum {{minimumLength}} caractères (actuellement: {{currentLength}})',
    maxLength: 'Doit avoir maximum {{maximumLength}} caractères (actuellement: {{currentLength}})',
    pattern: 'Doit respecter: {{requiredPattern}}',
    format: function (error) {
        switch (error.requiredFormat) {
            case 'date':
                return 'Doit être une date, tel que "2000-12-31"';
            case 'time':
                return 'Doit être une heure, tel que "16:20" ou "03:14:15.9265"';
            case 'date-time':
                return 'Doit être une date et une heure, tel que "2000-03-14T01:59" ou "2000-03-14T01:59:26.535Z"';
            case 'email':
                return 'Doit être une adresse e-mail, tel que "name@example.com"';
            case 'hostname':
                return 'Doit être un nom de domaine, tel que "example.com"';
            case 'ipv4':
                return 'Doit être une adresse IPv4, tel que "127.0.0.1"';
            case 'ipv6':
                return 'Doit être une adresse IPv6, tel que "1234:5678:9ABC:DEF0:1234:5678:9ABC:DEF0"';
            // TODO: add examples for 'uri', 'uri-reference', and 'uri-template'
            // case 'uri': case 'uri-reference': case 'uri-template':
            case 'url':
                return 'Doit être une URL, tel que "http://www.example.com/page.html"';
            case 'uuid':
                return 'Doit être un UUID, tel que "12345678-9ABC-DEF0-1234-56789ABCDEF0"';
            case 'color':
                return 'Doit être une couleur, tel que "#FFFFFF" or "rgb(255, 255, 255)"';
            case 'json-pointer':
                return 'Doit être un JSON Pointer, tel que "/pointer/to/something"';
            case 'relative-json-pointer':
                return 'Doit être un relative JSON Pointer, tel que "2/pointer/to/something"';
            case 'regex':
                return 'Doit être une expression régulière, tel que "(1-)?\\d{3}-\\d{3}-\\d{4}"';
            default:
                return 'Doit être avoir le format correct: ' + error.requiredFormat;
        }
    },
    minimum: 'Doit être supérieur à {{minimumValue}}',
    exclusiveMinimum: 'Doit avoir minimum {{exclusiveMinimumValue}} charactères',
    maximum: 'Doit être inférieur à {{maximumValue}}',
    exclusiveMaximum: 'Doit avoir maximum {{exclusiveMaximumValue}} charactères',
    multipleOf: function (error) {
        if ((1 / error.multipleOfValue) % 10 === 0) {
            const decimals = Math.log10(1 / error.multipleOfValue);
            return `Doit comporter ${decimals} ou moins de decimales.`;
        }
        else {
            return `Doit être un multiple de ${error.multipleOfValue}.`;
        }
    },
    minProperties: 'Doit comporter au minimum {{minimumProperties}} éléments',
    maxProperties: 'Doit comporter au maximum {{maximumProperties}} éléments',
    minItems: 'Doit comporter au minimum {{minimumItems}} éléments',
    maxItems: 'Doit comporter au maximum {{minimumItems}} éléments',
    uniqueItems: 'Tous les éléments doivent être uniques',
    // Note: No default error messages for 'type', 'const', 'enum', or 'dependencies'
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnItdmFsaWRhdGlvbi1tZXNzYWdlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nLWZvcm13b3Jrcy1jb3JlL3NyYy9saWIvbG9jYWxlL2ZyLXZhbGlkYXRpb24tbWVzc2FnZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE1BQU0sb0JBQW9CLEdBQVE7SUFDdkMsUUFBUSxFQUFFLGtCQUFrQjtJQUM1QixTQUFTLEVBQUUsbUZBQW1GO0lBQzlGLFNBQVMsRUFBRSxtRkFBbUY7SUFDOUYsT0FBTyxFQUFFLHFDQUFxQztJQUM5QyxNQUFNLEVBQUUsVUFBVSxLQUFLO1FBQ3JCLFFBQVEsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQzdCLEtBQUssTUFBTTtnQkFDVCxPQUFPLDBDQUEwQyxDQUFDO1lBQ3BELEtBQUssTUFBTTtnQkFDVCxPQUFPLHlEQUF5RCxDQUFDO1lBQ25FLEtBQUssV0FBVztnQkFDZCxPQUFPLDJGQUEyRixDQUFDO1lBQ3JHLEtBQUssT0FBTztnQkFDVixPQUFPLDBEQUEwRCxDQUFDO1lBQ3BFLEtBQUssVUFBVTtnQkFDYixPQUFPLG9EQUFvRCxDQUFDO1lBQzlELEtBQUssTUFBTTtnQkFDVCxPQUFPLGlEQUFpRCxDQUFDO1lBQzNELEtBQUssTUFBTTtnQkFDVCxPQUFPLCtFQUErRSxDQUFDO1lBQ3pGLG9FQUFvRTtZQUNwRSx5REFBeUQ7WUFDekQsS0FBSyxLQUFLO2dCQUNSLE9BQU8sK0RBQStELENBQUM7WUFDekUsS0FBSyxNQUFNO2dCQUNULE9BQU8sbUVBQW1FLENBQUM7WUFDN0UsS0FBSyxPQUFPO2dCQUNWLE9BQU8sa0VBQWtFLENBQUM7WUFDNUUsS0FBSyxjQUFjO2dCQUNqQixPQUFPLDREQUE0RCxDQUFDO1lBQ3RFLEtBQUssdUJBQXVCO2dCQUMxQixPQUFPLHNFQUFzRSxDQUFDO1lBQ2hGLEtBQUssT0FBTztnQkFDVixPQUFPLHlFQUF5RSxDQUFDO1lBQ25GO2dCQUNFLE9BQU8scUNBQXFDLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQztRQUN4RSxDQUFDO0lBQ0gsQ0FBQztJQUNELE9BQU8sRUFBRSx3Q0FBd0M7SUFDakQsZ0JBQWdCLEVBQUUsMERBQTBEO0lBQzVFLE9BQU8sRUFBRSx3Q0FBd0M7SUFDakQsZ0JBQWdCLEVBQUUsMERBQTBEO0lBQzVFLFVBQVUsRUFBRSxVQUFVLEtBQUs7UUFDekIsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQzNDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN2RCxPQUFPLGtCQUFrQixRQUFRLHlCQUF5QixDQUFDO1FBQzdELENBQUM7YUFBTSxDQUFDO1lBQ04sT0FBTyw0QkFBNEIsS0FBSyxDQUFDLGVBQWUsR0FBRyxDQUFDO1FBQzlELENBQUM7SUFDSCxDQUFDO0lBQ0QsYUFBYSxFQUFFLDBEQUEwRDtJQUN6RSxhQUFhLEVBQUUsMERBQTBEO0lBQ3pFLFFBQVEsRUFBRSxxREFBcUQ7SUFDL0QsUUFBUSxFQUFFLHFEQUFxRDtJQUMvRCxXQUFXLEVBQUUsd0NBQXdDO0lBQ3JELGlGQUFpRjtDQUNsRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGZyVmFsaWRhdGlvbk1lc3NhZ2VzOiBhbnkgPSB7IC8vIEZyZW5jaCBlcnJvciBtZXNzYWdlc1xuICByZXF1aXJlZDogJ0VzdCBvYmxpZ2F0b2lyZS4nLFxuICBtaW5MZW5ndGg6ICdEb2l0IGF2b2lyIG1pbmltdW0ge3ttaW5pbXVtTGVuZ3RofX0gY2FyYWN0w6hyZXMgKGFjdHVlbGxlbWVudDoge3tjdXJyZW50TGVuZ3RofX0pJyxcbiAgbWF4TGVuZ3RoOiAnRG9pdCBhdm9pciBtYXhpbXVtIHt7bWF4aW11bUxlbmd0aH19IGNhcmFjdMOocmVzIChhY3R1ZWxsZW1lbnQ6IHt7Y3VycmVudExlbmd0aH19KScsXG4gIHBhdHRlcm46ICdEb2l0IHJlc3BlY3Rlcjoge3tyZXF1aXJlZFBhdHRlcm59fScsXG4gIGZvcm1hdDogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgc3dpdGNoIChlcnJvci5yZXF1aXJlZEZvcm1hdCkge1xuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgIHJldHVybiAnRG9pdCDDqnRyZSB1bmUgZGF0ZSwgdGVsIHF1ZSBcIjIwMDAtMTItMzFcIic7XG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgcmV0dXJuICdEb2l0IMOqdHJlIHVuZSBoZXVyZSwgdGVsIHF1ZSBcIjE2OjIwXCIgb3UgXCIwMzoxNDoxNS45MjY1XCInO1xuICAgICAgY2FzZSAnZGF0ZS10aW1lJzpcbiAgICAgICAgcmV0dXJuICdEb2l0IMOqdHJlIHVuZSBkYXRlIGV0IHVuZSBoZXVyZSwgdGVsIHF1ZSBcIjIwMDAtMDMtMTRUMDE6NTlcIiBvdSBcIjIwMDAtMDMtMTRUMDE6NTk6MjYuNTM1WlwiJztcbiAgICAgIGNhc2UgJ2VtYWlsJzpcbiAgICAgICAgcmV0dXJuICdEb2l0IMOqdHJlIHVuZSBhZHJlc3NlIGUtbWFpbCwgdGVsIHF1ZSBcIm5hbWVAZXhhbXBsZS5jb21cIic7XG4gICAgICBjYXNlICdob3N0bmFtZSc6XG4gICAgICAgIHJldHVybiAnRG9pdCDDqnRyZSB1biBub20gZGUgZG9tYWluZSwgdGVsIHF1ZSBcImV4YW1wbGUuY29tXCInO1xuICAgICAgY2FzZSAnaXB2NCc6XG4gICAgICAgIHJldHVybiAnRG9pdCDDqnRyZSB1bmUgYWRyZXNzZSBJUHY0LCB0ZWwgcXVlIFwiMTI3LjAuMC4xXCInO1xuICAgICAgY2FzZSAnaXB2Nic6XG4gICAgICAgIHJldHVybiAnRG9pdCDDqnRyZSB1bmUgYWRyZXNzZSBJUHY2LCB0ZWwgcXVlIFwiMTIzNDo1Njc4OjlBQkM6REVGMDoxMjM0OjU2Nzg6OUFCQzpERUYwXCInO1xuICAgICAgLy8gVE9ETzogYWRkIGV4YW1wbGVzIGZvciAndXJpJywgJ3VyaS1yZWZlcmVuY2UnLCBhbmQgJ3VyaS10ZW1wbGF0ZSdcbiAgICAgIC8vIGNhc2UgJ3VyaSc6IGNhc2UgJ3VyaS1yZWZlcmVuY2UnOiBjYXNlICd1cmktdGVtcGxhdGUnOlxuICAgICAgY2FzZSAndXJsJzpcbiAgICAgICAgcmV0dXJuICdEb2l0IMOqdHJlIHVuZSBVUkwsIHRlbCBxdWUgXCJodHRwOi8vd3d3LmV4YW1wbGUuY29tL3BhZ2UuaHRtbFwiJztcbiAgICAgIGNhc2UgJ3V1aWQnOlxuICAgICAgICByZXR1cm4gJ0RvaXQgw6p0cmUgdW4gVVVJRCwgdGVsIHF1ZSBcIjEyMzQ1Njc4LTlBQkMtREVGMC0xMjM0LTU2Nzg5QUJDREVGMFwiJztcbiAgICAgIGNhc2UgJ2NvbG9yJzpcbiAgICAgICAgcmV0dXJuICdEb2l0IMOqdHJlIHVuZSBjb3VsZXVyLCB0ZWwgcXVlIFwiI0ZGRkZGRlwiIG9yIFwicmdiKDI1NSwgMjU1LCAyNTUpXCInO1xuICAgICAgY2FzZSAnanNvbi1wb2ludGVyJzpcbiAgICAgICAgcmV0dXJuICdEb2l0IMOqdHJlIHVuIEpTT04gUG9pbnRlciwgdGVsIHF1ZSBcIi9wb2ludGVyL3RvL3NvbWV0aGluZ1wiJztcbiAgICAgIGNhc2UgJ3JlbGF0aXZlLWpzb24tcG9pbnRlcic6XG4gICAgICAgIHJldHVybiAnRG9pdCDDqnRyZSB1biByZWxhdGl2ZSBKU09OIFBvaW50ZXIsIHRlbCBxdWUgXCIyL3BvaW50ZXIvdG8vc29tZXRoaW5nXCInO1xuICAgICAgY2FzZSAncmVnZXgnOlxuICAgICAgICByZXR1cm4gJ0RvaXQgw6p0cmUgdW5lIGV4cHJlc3Npb24gcsOpZ3VsacOocmUsIHRlbCBxdWUgXCIoMS0pP1xcXFxkezN9LVxcXFxkezN9LVxcXFxkezR9XCInO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuICdEb2l0IMOqdHJlIGF2b2lyIGxlIGZvcm1hdCBjb3JyZWN0OiAnICsgZXJyb3IucmVxdWlyZWRGb3JtYXQ7XG4gICAgfVxuICB9LFxuICBtaW5pbXVtOiAnRG9pdCDDqnRyZSBzdXDDqXJpZXVyIMOgIHt7bWluaW11bVZhbHVlfX0nLFxuICBleGNsdXNpdmVNaW5pbXVtOiAnRG9pdCBhdm9pciBtaW5pbXVtIHt7ZXhjbHVzaXZlTWluaW11bVZhbHVlfX0gY2hhcmFjdMOocmVzJyxcbiAgbWF4aW11bTogJ0RvaXQgw6p0cmUgaW5mw6lyaWV1ciDDoCB7e21heGltdW1WYWx1ZX19JyxcbiAgZXhjbHVzaXZlTWF4aW11bTogJ0RvaXQgYXZvaXIgbWF4aW11bSB7e2V4Y2x1c2l2ZU1heGltdW1WYWx1ZX19IGNoYXJhY3TDqHJlcycsXG4gIG11bHRpcGxlT2Y6IGZ1bmN0aW9uIChlcnJvcikge1xuICAgIGlmICgoMSAvIGVycm9yLm11bHRpcGxlT2ZWYWx1ZSkgJSAxMCA9PT0gMCkge1xuICAgICAgY29uc3QgZGVjaW1hbHMgPSBNYXRoLmxvZzEwKDEgLyBlcnJvci5tdWx0aXBsZU9mVmFsdWUpO1xuICAgICAgcmV0dXJuIGBEb2l0IGNvbXBvcnRlciAke2RlY2ltYWxzfSBvdSBtb2lucyBkZSBkZWNpbWFsZXMuYDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGBEb2l0IMOqdHJlIHVuIG11bHRpcGxlIGRlICR7ZXJyb3IubXVsdGlwbGVPZlZhbHVlfS5gO1xuICAgIH1cbiAgfSxcbiAgbWluUHJvcGVydGllczogJ0RvaXQgY29tcG9ydGVyIGF1IG1pbmltdW0ge3ttaW5pbXVtUHJvcGVydGllc319IMOpbMOpbWVudHMnLFxuICBtYXhQcm9wZXJ0aWVzOiAnRG9pdCBjb21wb3J0ZXIgYXUgbWF4aW11bSB7e21heGltdW1Qcm9wZXJ0aWVzfX0gw6lsw6ltZW50cycsXG4gIG1pbkl0ZW1zOiAnRG9pdCBjb21wb3J0ZXIgYXUgbWluaW11bSB7e21pbmltdW1JdGVtc319IMOpbMOpbWVudHMnLFxuICBtYXhJdGVtczogJ0RvaXQgY29tcG9ydGVyIGF1IG1heGltdW0ge3ttaW5pbXVtSXRlbXN9fSDDqWzDqW1lbnRzJyxcbiAgdW5pcXVlSXRlbXM6ICdUb3VzIGxlcyDDqWzDqW1lbnRzIGRvaXZlbnQgw6p0cmUgdW5pcXVlcycsXG4gIC8vIE5vdGU6IE5vIGRlZmF1bHQgZXJyb3IgbWVzc2FnZXMgZm9yICd0eXBlJywgJ2NvbnN0JywgJ2VudW0nLCBvciAnZGVwZW5kZW5jaWVzJ1xufTtcbiJdfQ==