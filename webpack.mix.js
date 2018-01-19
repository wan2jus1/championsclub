let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application.` By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
// mix.js('resources/assets/js/main.js', 'public/js')
//     .sass('resources/assets/sass/app.scss', 'public/css')
//     .options({
//         processCssUrls: false
//     });

mix.js('resources/assets/js/game_choose/main.js', 'public/js')
    .sass('resources/assets/sass/app.scss', 'public/css')
    .options({
        processCssUrls: false
    });
// mix.sass('resources/assets/sass/divslot/games/bookofwinner.scss', 'public/css')
mix.sass('resources/assets/sass/divslot/games/bookofwinner.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/sevensonfireplus.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/sevensonfire.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/firerageplus.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/triplediamond.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/kingsofjewels.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/crazybarmen.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/scatterwins.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/computerworld.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/hearts.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/gatesofavalon.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/money.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/nautilus.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/goldenharvest.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/bananas.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/mariner.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/riddleofthesphinx.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/rolloframses.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/snowwhite.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/tropicalfruit.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/billiardworld.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/ultrasevenhot.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/hitjewels.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/robinson.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/firerage.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/bookofwins.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/casinoworld.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/pepperseven.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/magicsecret.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/casinoandstars.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/beautydolphins.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/savannaqueen.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/hotsevens.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/icelegend.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/goldenscatter.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/luckyladysglamor.scss', 'public/css')
    .sass('resources/assets/sass/divslot/games/captain.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/hotslot.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/alwayscherry.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/dolphinspearl.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/queenofhearts.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/bananasgobahamas.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/themoneygame.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/luckyladyscharm.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/venetiamcarnival.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/sealight.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/columbus.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/sharky.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/firefrenzy.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/aliceinwonderland.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/sizzlinghot.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/gryphonsgold.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/bookofra.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/crazybarmenold.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/cinema.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/computerworldold.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/nautilusold.scss', 'public/css')
    // .sass('resources/assets/sass/divslot/games/gulliver.scss', 'public/css')
    .options({
        processCssUrls: false
    });