var settings = {
    "symbolSize": 233,
    "spaceBetweenReels": 23,

    "numOfRows": 3,
    "numOfReels": 5,

    "animationType": 'fall',

    "numOfSpinsBeforeStop": 3,

    "delayBetweenShowingWinningLines": 700,
    "delayBetweenReelsSpin": 200,
    "delayBetweenFallingSymbols": 300,

    // Do not set this delay lower than 50 ms
    // due to the slow browsers perfomance
    "delayBeforeStartReelsSpin": 200,
    "spinAnimationTimeInMs": 1000,

    "gamblePreviousCardsAmount": 7,
    "gambleExtended": true,

    "imagesPath": "public/img/games/computerworld/",
    "helpType": "slider",

    "symbolsImagesPath": "public/img/games/computerworld/symbols/",
    "symbolsAnimationsPath": "public/img/games/computerworld/symbols/animations/",

    "symbols": [
        {
            "image": "1.png",
            "paytable": [0,0,5,25,100]
        }, {
            "image": "2.png",
            "paytable": [0,0,5,40,150]
        }, {
            "image": "3.png",
            "paytable": [0,5,40,400,2000]
        }, {
            "image": "4.png",
            "paytable": [0,10,100,1000,5000]
        }, {
            "image": "5.png",
            "paytable": [0,0,5,25,100]
        }, {
            "image": "6.png",
            "paytable": [0,0,5,40,150]
        }, {
            "image": "7.png",
            "isScatter": true,
            "paytable": [0,0,3,30,300]
        }, {
            "image": "8.png",
            "paytable": [00,5,30,100,750]
        }, {
            "image": "9.png",
            "paytable": [0,5,30,100,750]
        }, {
            "image": "10.png",
            "paytable": [0,0,5,40,150]
        },
    ],
}
