# Fastenkalender

Der Fastenkalender soll helfen, den Überblick über die aktuelle Fastenzeit
zu behalten. Wie lange dauert sie noch? Habe ich mein Fastenziel erreicht?

## Technik

Der Fastenkalender ist eine HTML5/React Anwendung, gebaut mit
[Brunch](http://brunch.io).

* Install (if you don't have them):
    * [Node.js](http://nodejs.org): `brew install node` on OS X
    * [Brunch](http://brunch.io): `npm install -g brunch`
    * Brunch plugins and app dependencies: `npm install`
* Run:
    * `brunch watch --server` — watches the project with continuous rebuild. This will also launch HTTP server with [pushState](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history).
    * `brunch build --production` — builds minified project for production
    * `public/` dir is fully auto-generated and served by HTTP server.  Write your code in `app/` dir.
* Learn:
    * Place static files you want to be copied from `app/assets/` to `public/`.
    * [Brunch site](http://brunch.io), [Getting started guide](https://github.com/brunch/brunch-guide#readme)

