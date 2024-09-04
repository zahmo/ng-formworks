# @ng-formworks/daisyui
This module is a dependency of the [ng-formworks project][npm_core_ver] and is meant to work as a framework installation module for using DaisyUI in the forms.

## Getting started

If you are unfamiliar with with the ng-formworks project, it is highly recommended to 
first have a look at the [@ng-formworks pages][npm_core_ver] for examples, demos, options and documentation.

## Getting started

```shell
npm install @ng-formworks/core@latest @ng-formworks/cssframework@latest @ng-formworks/daisyui@latest
```

With YARN, run the following:

```shell
yarn add @ng-formworks/core@latest @ng-formworks/cssframework@latest @ng-formworks/daisyui@latest
```

Then import `DaisyUIFrameworkModule` in your main application module if you want to use `daisyui` UI, like this:

```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DaisyUIFrameworkModule } from '@ng-formworks/daisyui';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    DaisyUIFrameworkModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
```

For basic use, after loading JsonSchemaFormModule as described above, to display a form in your Angular component, simply add the following to your component's template:

```html
<json-schema-form
  loadExternalAssets="true"
  [schema]="yourJsonSchema"
  framework="daisyui"
  [theme]="yourTheme"
  (onSubmit)="yourOnSubmitFn($event)">
</json-schema-form>
```

Where `schema` is a valid JSON schema object, and `onSubmit` calls a function to process the submitted JSON form data. If you don't already have your own schemas, you can find a bunch of samples to test with in the `demo/assets/example-schemas` folder, as described above.

`framework` is for the template you want to use, the default value is `no-framwork`. The possible values are:

* `material-design` for  Material Design (if installed).
* `bootstrap-3` for Bootstrap 3 (if installed).
* `bootstrap-4` for Bootstrap 4 (if installed).
* `bootstrap-5` for Bootstrap 5 (if installed).
* `daisyui` for DaisyUi. 
* `no-framework` for (plain HTML).

`theme` is for the framework theme you want to use. 
The possible values for this framework are:

* `daisyui_default` for the default theme.
* `light` for the light theme.
* `dark` for the dark theme.
* `cupcake` for the cupcake theme.
* `cmyk` for the cmyk theme.
* `pastel` for the pastel theme.
* `daisyui_leaf` for the leaf theme.

the list of available themes can also be gotten using the 
FrameworkLibraryService(found in '@ng-formworks/core'): 
 ```typescript
 getFrameworkThemes()
 ``` 
 method 

## Custom theming

Custom theming can be achieved in two ways:

* the simplest is to overwrite the default theme(or any other themes) with css rules:
css changes can be made using the `data-theme` attribute selector
so for example to change the .btn class of the default theme, you would
include the following rule in your application's styles

```css
[data-theme="daisyui_default"] .btn {
    border-radius: 1rem
}
```

* the other method is to add a new theme:
the first step will be to create the entire theme (see the specific frameworks underlying documentation for how this can be done) and have it use the `data-theme` attribute selector for example:

```css
[data-theme="daisyui_custom"] {
    background-color: green;
    font: 15px Arial, sans-serif;
    .
    .
    .
}
[data-theme="daisyui_custom"] .btn {
    border-color: coral;
    .
    .
    .
}

```
after making the css available, the theme will need to be registered using the  
FrameworkLibraryService(found in '@ng-formworks/core'):
for example 

```typescript
  constructor(
    .
    private frameworkLibrary: FrameworkLibraryService,
    .
    .
  ) { 

    frameworkLibrary.registerTheme({name:'daisyui_custom',text:'DaisyUi custom theme'})

  }

```

## Using default DaisyUI css class names

By default, the framework prefixes all standard DaisyUI class names with 'dui-'
for example '.btn' will become '.dui-btn'. The standard names can be switched back without the 'dui-' prefix if need be. To switch opf the 'dui-' prefixing, the DUIOPTIONS token value needs to be provided with the classPrefix property set to false-see code snippet below. By default the classPrefix property is true. 

```typescript

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {DUIOPTIONS, DaisyUIFrameworkModule } from '@ng-formworks/daisyui';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    DaisyUIFrameworkModule
  ],
  providers: [
    { provide: DUIOPTIONS, useValue: {classPrefix:false} }
    ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

```

## Code scaffolding

Run `ng generate component component-name --project @ng-formworks/daisyui` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project @ng-formworks/daisyui`.
> Note: Don't forget to add `--project @ng-formworks/daisyui` or else it will be added to the default project in your `angular.json` file.

## Build

Run `ng build @ng-formworks/daisyui` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test @ng-formworks/daisyui` to execute the unit tests via [Karma](https://karma-runner.github.io).

[npm_core_ver]:https://www.npmjs.com/package/@ng-formworks/core
