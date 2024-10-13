export const zhValidationMessages = {
    required: '必填字段.',
    minLength: '字符长度必须大于或者等于 {{minimumLength}} (当前长度: {{currentLength}})',
    maxLength: '字符长度必须小于或者等于 {{maximumLength}} (当前长度: {{currentLength}})',
    pattern: '必须匹配正则表达式: {{requiredPattern}}',
    format: function (error) {
        switch (error.requiredFormat) {
            case 'date':
                return '必须为日期格式, 比如 "2000-12-31"';
            case 'time':
                return '必须为时间格式, 比如 "16:20" 或者 "03:14:15.9265"';
            case 'date-time':
                return '必须为日期时间格式, 比如 "2000-03-14T01:59" 或者 "2000-03-14T01:59:26.535Z"';
            case 'email':
                return '必须为邮箱地址, 比如 "name@example.com"';
            case 'hostname':
                return '必须为主机名, 比如 "example.com"';
            case 'ipv4':
                return '必须为 IPv4 地址, 比如 "127.0.0.1"';
            case 'ipv6':
                return '必须为 IPv6 地址, 比如 "1234:5678:9ABC:DEF0:1234:5678:9ABC:DEF0"';
            // TODO: add examples for 'uri', 'uri-reference', and 'uri-template'
            // case 'uri': case 'uri-reference': case 'uri-template':
            case 'url':
                return '必须为 url, 比如 "http://www.example.com/page.html"';
            case 'uuid':
                return '必须为 uuid, 比如 "12345678-9ABC-DEF0-1234-56789ABCDEF0"';
            case 'color':
                return '必须为颜色值, 比如 "#FFFFFF" 或者 "rgb(255, 255, 255)"';
            case 'json-pointer':
                return '必须为 JSON Pointer, 比如 "/pointer/to/something"';
            case 'relative-json-pointer':
                return '必须为相对的 JSON Pointer, 比如 "2/pointer/to/something"';
            case 'regex':
                return '必须为正则表达式, 比如 "(1-)?\\d{3}-\\d{3}-\\d{4}"';
            default:
                return '必须为格式正确的 ' + error.requiredFormat;
        }
    },
    minimum: '必须大于或者等于最小值: {{minimumValue}}',
    exclusiveMinimum: '必须大于最小值: {{exclusiveMinimumValue}}',
    maximum: '必须小于或者等于最大值: {{maximumValue}}',
    exclusiveMaximum: '必须小于最大值: {{exclusiveMaximumValue}}',
    multipleOf: function (error) {
        if ((1 / error.multipleOfValue) % 10 === 0) {
            const decimals = Math.log10(1 / error.multipleOfValue);
            return `必须有 ${decimals} 位或更少的小数位`;
        }
        else {
            return `必须为 ${error.multipleOfValue} 的倍数`;
        }
    },
    minProperties: '项目数必须大于或者等于 {{minimumProperties}} (当前项目数: {{currentProperties}})',
    maxProperties: '项目数必须小于或者等于 {{maximumProperties}} (当前项目数: {{currentProperties}})',
    minItems: '项目数必须大于或者等于 {{minimumItems}} (当前项目数: {{currentItems}})',
    maxItems: '项目数必须小于或者等于 {{maximumItems}} (当前项目数: {{currentItems}})',
    uniqueItems: '所有项目必须是唯一的',
    // Note: No default error messages for 'type', 'const', 'enum', or 'dependencies'
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemgtdmFsaWRhdGlvbi1tZXNzYWdlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nLWZvcm13b3Jrcy1jb3JlL3NyYy9saWIvbG9jYWxlL3poLXZhbGlkYXRpb24tbWVzc2FnZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE1BQU0sb0JBQW9CLEdBQVE7SUFDdkMsUUFBUSxFQUFFLE9BQU87SUFDakIsU0FBUyxFQUFFLDBEQUEwRDtJQUNyRSxTQUFTLEVBQUUsMERBQTBEO0lBQ3JFLE9BQU8sRUFBRSxnQ0FBZ0M7SUFDekMsTUFBTSxFQUFFLFVBQVUsS0FBSztRQUNyQixRQUFRLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUM3QixLQUFLLE1BQU07Z0JBQ1QsT0FBTywwQkFBMEIsQ0FBQztZQUNwQyxLQUFLLE1BQU07Z0JBQ1QsT0FBTyx3Q0FBd0MsQ0FBQztZQUNsRCxLQUFLLFdBQVc7Z0JBQ2QsT0FBTyxnRUFBZ0UsQ0FBQztZQUMxRSxLQUFLLE9BQU87Z0JBQ1YsT0FBTyxnQ0FBZ0MsQ0FBQztZQUMxQyxLQUFLLFVBQVU7Z0JBQ2IsT0FBTywwQkFBMEIsQ0FBQztZQUNwQyxLQUFLLE1BQU07Z0JBQ1QsT0FBTyw2QkFBNkIsQ0FBQztZQUN2QyxLQUFLLE1BQU07Z0JBQ1QsT0FBTywyREFBMkQsQ0FBQztZQUNyRSxvRUFBb0U7WUFDcEUseURBQXlEO1lBQ3pELEtBQUssS0FBSztnQkFDUixPQUFPLGdEQUFnRCxDQUFDO1lBQzFELEtBQUssTUFBTTtnQkFDVCxPQUFPLHFEQUFxRCxDQUFDO1lBQy9ELEtBQUssT0FBTztnQkFDVixPQUFPLDhDQUE4QyxDQUFDO1lBQ3hELEtBQUssY0FBYztnQkFDakIsT0FBTyw4Q0FBOEMsQ0FBQztZQUN4RCxLQUFLLHVCQUF1QjtnQkFDMUIsT0FBTyxrREFBa0QsQ0FBQztZQUM1RCxLQUFLLE9BQU87Z0JBQ1YsT0FBTywwQ0FBMEMsQ0FBQztZQUNwRDtnQkFDRSxPQUFPLFdBQVcsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDO1FBQzlDLENBQUM7SUFDSCxDQUFDO0lBQ0QsT0FBTyxFQUFFLCtCQUErQjtJQUN4QyxnQkFBZ0IsRUFBRSxvQ0FBb0M7SUFDdEQsT0FBTyxFQUFFLCtCQUErQjtJQUN4QyxnQkFBZ0IsRUFBRSxvQ0FBb0M7SUFDdEQsVUFBVSxFQUFFLFVBQVUsS0FBSztRQUN6QixJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDM0MsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3ZELE9BQU8sT0FBTyxRQUFRLFdBQVcsQ0FBQztRQUNwQyxDQUFDO2FBQU0sQ0FBQztZQUNOLE9BQU8sT0FBTyxLQUFLLENBQUMsZUFBZSxNQUFNLENBQUM7UUFDNUMsQ0FBQztJQUNILENBQUM7SUFDRCxhQUFhLEVBQUUsa0VBQWtFO0lBQ2pGLGFBQWEsRUFBRSxrRUFBa0U7SUFDakYsUUFBUSxFQUFFLHdEQUF3RDtJQUNsRSxRQUFRLEVBQUUsd0RBQXdEO0lBQ2xFLFdBQVcsRUFBRSxZQUFZO0lBQ3pCLGlGQUFpRjtDQUNsRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IHpoVmFsaWRhdGlvbk1lc3NhZ2VzOiBhbnkgPSB7IC8vIENoaW5lc2UgZXJyb3IgbWVzc2FnZXNcbiAgcmVxdWlyZWQ6ICflv4XloavlrZfmrrUuJyxcbiAgbWluTGVuZ3RoOiAn5a2X56ym6ZW/5bqm5b+F6aG75aSn5LqO5oiW6ICF562J5LqOIHt7bWluaW11bUxlbmd0aH19ICjlvZPliY3plb/luqY6IHt7Y3VycmVudExlbmd0aH19KScsXG4gIG1heExlbmd0aDogJ+Wtl+espumVv+W6puW/hemhu+Wwj+S6juaIluiAheetieS6jiB7e21heGltdW1MZW5ndGh9fSAo5b2T5YmN6ZW/5bqmOiB7e2N1cnJlbnRMZW5ndGh9fSknLFxuICBwYXR0ZXJuOiAn5b+F6aG75Yy56YWN5q2j5YiZ6KGo6L6+5byPOiB7e3JlcXVpcmVkUGF0dGVybn19JyxcbiAgZm9ybWF0OiBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICBzd2l0Y2ggKGVycm9yLnJlcXVpcmVkRm9ybWF0KSB7XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgcmV0dXJuICflv4XpobvkuLrml6XmnJ/moLzlvI8sIOavlOWmgiBcIjIwMDAtMTItMzFcIic7XG4gICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgcmV0dXJuICflv4XpobvkuLrml7bpl7TmoLzlvI8sIOavlOWmgiBcIjE2OjIwXCIg5oiW6ICFIFwiMDM6MTQ6MTUuOTI2NVwiJztcbiAgICAgIGNhc2UgJ2RhdGUtdGltZSc6XG4gICAgICAgIHJldHVybiAn5b+F6aG75Li65pel5pyf5pe26Ze05qC85byPLCDmr5TlpoIgXCIyMDAwLTAzLTE0VDAxOjU5XCIg5oiW6ICFIFwiMjAwMC0wMy0xNFQwMTo1OToyNi41MzVaXCInO1xuICAgICAgY2FzZSAnZW1haWwnOlxuICAgICAgICByZXR1cm4gJ+W/hemhu+S4uumCrueuseWcsOWdgCwg5q+U5aaCIFwibmFtZUBleGFtcGxlLmNvbVwiJztcbiAgICAgIGNhc2UgJ2hvc3RuYW1lJzpcbiAgICAgICAgcmV0dXJuICflv4XpobvkuLrkuLvmnLrlkI0sIOavlOWmgiBcImV4YW1wbGUuY29tXCInO1xuICAgICAgY2FzZSAnaXB2NCc6XG4gICAgICAgIHJldHVybiAn5b+F6aG75Li6IElQdjQg5Zyw5Z2ALCDmr5TlpoIgXCIxMjcuMC4wLjFcIic7XG4gICAgICBjYXNlICdpcHY2JzpcbiAgICAgICAgcmV0dXJuICflv4XpobvkuLogSVB2NiDlnLDlnYAsIOavlOWmgiBcIjEyMzQ6NTY3ODo5QUJDOkRFRjA6MTIzNDo1Njc4OjlBQkM6REVGMFwiJztcbiAgICAgIC8vIFRPRE86IGFkZCBleGFtcGxlcyBmb3IgJ3VyaScsICd1cmktcmVmZXJlbmNlJywgYW5kICd1cmktdGVtcGxhdGUnXG4gICAgICAvLyBjYXNlICd1cmknOiBjYXNlICd1cmktcmVmZXJlbmNlJzogY2FzZSAndXJpLXRlbXBsYXRlJzpcbiAgICAgIGNhc2UgJ3VybCc6XG4gICAgICAgIHJldHVybiAn5b+F6aG75Li6IHVybCwg5q+U5aaCIFwiaHR0cDovL3d3dy5leGFtcGxlLmNvbS9wYWdlLmh0bWxcIic7XG4gICAgICBjYXNlICd1dWlkJzpcbiAgICAgICAgcmV0dXJuICflv4XpobvkuLogdXVpZCwg5q+U5aaCIFwiMTIzNDU2NzgtOUFCQy1ERUYwLTEyMzQtNTY3ODlBQkNERUYwXCInO1xuICAgICAgY2FzZSAnY29sb3InOlxuICAgICAgICByZXR1cm4gJ+W/hemhu+S4uuminOiJsuWAvCwg5q+U5aaCIFwiI0ZGRkZGRlwiIOaIluiAhSBcInJnYigyNTUsIDI1NSwgMjU1KVwiJztcbiAgICAgIGNhc2UgJ2pzb24tcG9pbnRlcic6XG4gICAgICAgIHJldHVybiAn5b+F6aG75Li6IEpTT04gUG9pbnRlciwg5q+U5aaCIFwiL3BvaW50ZXIvdG8vc29tZXRoaW5nXCInO1xuICAgICAgY2FzZSAncmVsYXRpdmUtanNvbi1wb2ludGVyJzpcbiAgICAgICAgcmV0dXJuICflv4XpobvkuLrnm7jlr7nnmoQgSlNPTiBQb2ludGVyLCDmr5TlpoIgXCIyL3BvaW50ZXIvdG8vc29tZXRoaW5nXCInO1xuICAgICAgY2FzZSAncmVnZXgnOlxuICAgICAgICByZXR1cm4gJ+W/hemhu+S4uuato+WImeihqOi+vuW8jywg5q+U5aaCIFwiKDEtKT9cXFxcZHszfS1cXFxcZHszfS1cXFxcZHs0fVwiJztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiAn5b+F6aG75Li65qC85byP5q2j56Gu55qEICcgKyBlcnJvci5yZXF1aXJlZEZvcm1hdDtcbiAgICB9XG4gIH0sXG4gIG1pbmltdW06ICflv4XpobvlpKfkuo7miJbogIXnrYnkuo7mnIDlsI/lgLw6IHt7bWluaW11bVZhbHVlfX0nLFxuICBleGNsdXNpdmVNaW5pbXVtOiAn5b+F6aG75aSn5LqO5pyA5bCP5YC8OiB7e2V4Y2x1c2l2ZU1pbmltdW1WYWx1ZX19JyxcbiAgbWF4aW11bTogJ+W/hemhu+Wwj+S6juaIluiAheetieS6juacgOWkp+WAvDoge3ttYXhpbXVtVmFsdWV9fScsXG4gIGV4Y2x1c2l2ZU1heGltdW06ICflv4XpobvlsI/kuo7mnIDlpKflgLw6IHt7ZXhjbHVzaXZlTWF4aW11bVZhbHVlfX0nLFxuICBtdWx0aXBsZU9mOiBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICBpZiAoKDEgLyBlcnJvci5tdWx0aXBsZU9mVmFsdWUpICUgMTAgPT09IDApIHtcbiAgICAgIGNvbnN0IGRlY2ltYWxzID0gTWF0aC5sb2cxMCgxIC8gZXJyb3IubXVsdGlwbGVPZlZhbHVlKTtcbiAgICAgIHJldHVybiBg5b+F6aG75pyJICR7ZGVjaW1hbHN9IOS9jeaIluabtOWwkeeahOWwj+aVsOS9jWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBg5b+F6aG75Li6ICR7ZXJyb3IubXVsdGlwbGVPZlZhbHVlfSDnmoTlgI3mlbBgO1xuICAgIH1cbiAgfSxcbiAgbWluUHJvcGVydGllczogJ+mhueebruaVsOW/hemhu+Wkp+S6juaIluiAheetieS6jiB7e21pbmltdW1Qcm9wZXJ0aWVzfX0gKOW9k+WJjemhueebruaVsDoge3tjdXJyZW50UHJvcGVydGllc319KScsXG4gIG1heFByb3BlcnRpZXM6ICfpobnnm67mlbDlv4XpobvlsI/kuo7miJbogIXnrYnkuo4ge3ttYXhpbXVtUHJvcGVydGllc319ICjlvZPliY3pobnnm67mlbA6IHt7Y3VycmVudFByb3BlcnRpZXN9fSknLFxuICBtaW5JdGVtczogJ+mhueebruaVsOW/hemhu+Wkp+S6juaIluiAheetieS6jiB7e21pbmltdW1JdGVtc319ICjlvZPliY3pobnnm67mlbA6IHt7Y3VycmVudEl0ZW1zfX0pJyxcbiAgbWF4SXRlbXM6ICfpobnnm67mlbDlv4XpobvlsI/kuo7miJbogIXnrYnkuo4ge3ttYXhpbXVtSXRlbXN9fSAo5b2T5YmN6aG555uu5pWwOiB7e2N1cnJlbnRJdGVtc319KScsXG4gIHVuaXF1ZUl0ZW1zOiAn5omA5pyJ6aG555uu5b+F6aG75piv5ZSv5LiA55qEJyxcbiAgLy8gTm90ZTogTm8gZGVmYXVsdCBlcnJvciBtZXNzYWdlcyBmb3IgJ3R5cGUnLCAnY29uc3QnLCAnZW51bScsIG9yICdkZXBlbmRlbmNpZXMnXG59O1xuIl19