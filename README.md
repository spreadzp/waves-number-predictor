# AngularIonicNGXSDapp

DAPP is  a Gambling Game 
with Waves blockchain and APP with Angular, Ionic 4, Capacitor and NGXS (State Management).

## Start fake json server

```bash
    
    $ cd json-server 
    $ json-server --watch db.json
    $ npm install -g @waves/surfboard
    $ sudo docker run -d -p 6869:6869 wavesplatform/waves-private-node
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

 
## Capacitor: Syncing your app
Every time you perform a build (e.g. npm run build) that changes your web directory (default: www), you'll need to copy those changes down to your native projects:

``` bash
    $ npx cap copy
```

## Capacitor: Open IDE to build

``` bash
    $ npx cap open ios
    $ npx cap open android
```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
