# @ng-formworks/bootstrap4
This module is a dependency of the [ng-formworks project][npm_core_ver] and is meant to work as a framework installation module for using Bootstrap 4 in the forms.

## Getting started

If you are unfamiliar with with the ng-formworks project, it is highly recommended to 
first have a look at the [@ng-formworks pages][npm_core_ver] for examples, demos, options and documentation.
Before installing also have a look at the Angular/ng-formworks [version compatibility table][npm_core_ver#versions]

```shell
npm install @ng-formworks/core @ng-formworks/cssframework @ng-formworks/bootstrap4
```

With YARN, run the following:

```shell
yarn add @ng-formworks/core @ng-formworks/cssframework @ng-formworks/bootstrap4
```

Then import `Bootstrap4FrameworkModule` in your main application module if you want to use `bootstrap4` UI, like this:

```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Bootstrap4FrameworkModule } from '@ng-formworks/bootstrap4';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    Bootstrap4FrameworkModule
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
  framework="bootstrap-4"
  [theme]="yourTheme"
  (onSubmit)="yourOnSubmitFn($event)">
</json-schema-form>
```

Where `schema` is a valid JSON schema object, and `onSubmit` calls a function to process the submitted JSON form data. If you don't already have your own schemas, you can find a bunch of samples to test with in the `demo/assets/example-schemas` folder, as described above.

`framework` is for the template you want to use, the default value is `no-framwork`. The possible values are:


* `material-design` for  Material Design (if installed).
* `bootstrap-3` for Bootstrap 3 (if installed).
* `bootstrap-4` for Bootstrap 4 
* `bootstrap-5` for Bootstrap 5.(if installed).
* `daisyui` for DaisyUi (if installed).
* `no-framework` for (plain HTML).

`theme` is for the framework theme you want to use. 
The possible values for this framework are:

* `bootstrap4_default` for the default theme.

the list of available themes can also be gotten using the 
FrameworkLibraryService(found in '@ng-formworks/core'): 
 ```typescript
 getFrameworkThemes()
 ``` 
 method

## Custom theming

Custom theming can be achieved in two ways:

* the simplest is to overwrite the default theme(or any other themes) with css rules:
css changes can be made using the `data-bs-theme` attribute selector
so for example to change the .btn class of the default theme, you would
include the following rule in your application's styles

```css
[data-bs-theme="bootstrap4_default"] .btn {
    border-radius: 1rem
}
```

* the other method is to add a new theme:
the first step will be to create the entire theme (see the specific frameworks underlying documentation for how this can be done) and have it use the `data-bs-theme` attribute selector for example:

```css
[data-bs-theme="bootstrap4_custom"] {
    background-color: green;
    font: 15px Arial, sans-serif;
    .
    .
    .
}
[data-bs-theme="bootstrap4_custom"] .btn {
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

    frameworkLibrary.registerTheme({name:'bootstrap4_custom',text:'Bootstrap4 custom theme'})

  }

```

## Framework assets

Framework assets are typically third party assets (mainly js and css files) that are loaded at runtime for the particular framework's styling and effects to activate.
By default these assets are loaded from built in cdn urls. These assets can also be self hosted or loaded from different urls if need be.
To use custom urls the following steps must be followed:


* create a file called assets.json somewhere in your app src folder
* edit the assets.json file so that it contains both 'stylesheets' and 'scripts' properties-ex:

```
{

    "stylesheets": [
      "http://some.domain/css/style1.css",
      "http://some.domain/css/style2.css",
      "localstyle.css",
      ...
      ],
    "scripts": [
      "http://some.domain/css/script1.js",
      "localscript.js",
      ...
    ]

}

```
* adapt your apps angular.json assets config accordingly, for example:
    
```
	"projects": {
        "<your project name>": {
			...
            "architect": {
                "build": {
                    "builder": "@angular-devkit/build-angular:browser",
                    "options": {
                        ...
                        "assets": [
                            ...
                            {
                                "glob": "assets.json",
                                "input": "src",
                                "output": "/assets/bootstrap-4"
                            },
                            {
                                "glob": "localstyle.css",
                                "input": "./some/path/to/framework/cssfolder/",
                                "output": "/assets/bootstrap-4/cssframework"
                            },
                            {
                                "glob": "localscript.js",
                                "input": "./some/path/to/framework/jsfolder/",
                                "output": "/assets/bootstrap-4/cssframework"
                            }
                        ],
						...
```
Note that relative asset urls will be assumed to reside under "/assets/bootstrap-4/cssframework" and the assets.json file must output to "/assets/bootstrap-4"

for convenince a default assets.json file is included for including the framework assets
from the node_modules folder, this assumes that the third party libraries were installed locally with npm and that they will reside in the "/assets/bootstrap-4/cssframework" deployment folder. In this case, the following config can be used and adapted similar to above:

```
...
                        "assets": [
                            ...
                           {
                                "glob": "**/*",
                                "input": "./node_modules/@ng-formworks/bootstrap4/assets",
                                "output": "/assets/bootstrap-4"
                            },
                            {
                                "glob": "jquery.slim.min.js",
                                "input": "./node_modules/jquery/dist/",
                                "output": "/assets/bootstrap-4/cssframework"
                            },
                            {
                                "glob": "bootstrap.bundle.min.js",
                                "input": "./node_modules/bootstrap/dist/js/",
                                "output": "/assets/bootstrap-4/cssframework"
                            },
                            {
                                "glob": "bootstrap.min.css",
                                "input": "./node_modules/bootstrap/dist/css/",
                                "output": "/assets/bootstrap-4/cssframework"
                            }
                        ],
```


## Code scaffolding

Run `ng generate component component-name --project @ng-formworks/bootstrap4` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project @ng-formworks/bootstrap4`.
> Note: Don't forget to add `--project @ng-formworks/bootstrap4` or else it will be added to the default project in your `angular.json` file.

## Build

Run `ng build @ng-formworks/bootstrap4` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test @ng-formworks/bootstrap4` to execute the unit tests via [Karma](https://karma-runner.github.io).

[npm_core_ver]:https://www.npmjs.com/package/@ng-formworks/core
[npm_core_ver#versions]:https://www.npmjs.com/package/@ng-formworks/core#versions
