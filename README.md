# JO1N Nx workspace

SPA included:

- backoffice-eu

Based on:

- Angular 13,
- Angular Material 13,
- FUSE template from ThemeForest.
- Nx Nrwl Extensions for Angular

## PreRequirements

Node.js version 14.17.3

## Symlinks on Windows

In case of issues with symlink creation on Windows OS try this commands in each web app folder:

- del assets, configs
- mklink /D configs ..\..\..\configs
- mklink /D assets ..\..\..\assets

## Development server

Run `npm run start`
Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of
the source files.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the
[Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
