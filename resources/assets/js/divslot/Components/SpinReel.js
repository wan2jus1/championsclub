import Symbol from './Symbol';
import {transitionEnd} from '../events';

export default class Reel {
    /**
     * Create reel with starting symbols in it
     * @param {Number} reelIndex Index of reel in Game
     * @param {Function} onStop Function to call when reel has stopped
     */
    constructor(reelIndex, onStop) {
        this.finalSymbols = [];

        this.reelNode;
        this.reelIndex = reelIndex;

        this.props = {
            onStop
        };

        this._init();
    }

    _init() {
        this.reelNode = document.createElement('div');
        this.reelNode.className = 'reel';
        this.reelNode.style.transition = `transform ${settings.spinAnimationTimeInMs}ms ${settings.spinAnimTimingFunc}`;

        // Init starting symbols
        for (let i = 0; i < settings.numOfRows; i++) {
            let symbol;
            // Generate no scatters at all
            do {
                symbol = new Symbol(Math.floor(Math.random() * settings.symbols.length));
            } while (symbol.isScatter);

            this.finalSymbols.push(symbol);
            // Add symbol into reel node
            this.reelNode.appendChild(symbol.node);
        }

        const reelWrapperNode = document.createElement('div');
        reelWrapperNode.className = 'reel_wrapper';
        reelWrapperNode.style.width = `${settings.symbolSize}px`;
        reelWrapperNode.style.height = `${settings.symbolSize * settings.numOfRows}px`;
        reelWrapperNode.style.margin = `0 ${settings.spaceBetweenReels / 2}px`;
        reelWrapperNode.appendChild(this.reelNode);

        document.querySelector('#reels_container').appendChild(reelWrapperNode);

        this._initListeners();
    }

    _initListeners() {
        // End spin animation event
        this.reelNode.addEventListener(transitionEnd, () => {
            // Reset reel symbols
            this.resetReel();

            this.props.onStop(this.reelIndex);
        });
    }

    /**
     * Spin reel to final symbols
     * @param {Array<Symbol>} finalSymbols Array of final symbols
     */
    spin(finalSymbols) {
        this.addSpinningSymbols();
        this.addFinalSymbols(finalSymbols);

        // Animate spin
        this.reelNode.style.transform = `translate(0, ${((settings.numOfSpinsBeforeStop + 1) * settings.numOfRows) * settings.symbolSize}px)`;
    }

    addSpinningSymbols() {
        let spinningSymbolsArr = [];

        // TODO: Spawn scatter with some chance
        let isScatterSpawnedInReel = false;

        for (let i = 0; i < settings.numOfSpinsBeforeStop * settings.numOfRows; i++) {
            let symbol;
            let symbolCanPass;

            // Generate no scatters at all while spinning
            do {
                symbolCanPass = true;

                symbol = new Symbol(Math.floor(Math.random() * settings.symbols.length));

                if (symbol.isScatter) {
                    symbolCanPass = false;
                    continue;
                }

                // Rerandom if randomed symbol in not uniqe in 3 or less symbols generated before
                for (let i = spinningSymbolsArr.length - 1; i > spinningSymbolsArr.length - 4; i--) {
                    if (i < 0) break;

                    if (spinningSymbolsArr[i].symbolNum === symbol.symbolNum) {
                        symbolCanPass = false;
                    }
                }
            } while (!symbolCanPass);

            spinningSymbolsArr.push(symbol);
        }

        this.addSymbols(spinningSymbolsArr);
    }

    /**
     * Add final symbols to reel
     * @param {Array<Symbol>} finalSymbols Array of Symbols
     */
    addFinalSymbols(finalSymbolsMap) {
        let finalSymbols = [];

        for (let i = 0; i < finalSymbolsMap.length; i++) {
            finalSymbols.push(new Symbol(finalSymbolsMap[i]));
        }

        this.finalSymbols = finalSymbols.slice().reverse();

        this.addSymbols(finalSymbols);
    }

    /**
     * Change all symbols in reel with given symbol
     * @param {Number} symbolNum
     */
    async substitute(symbolNum) {
        // Gradually substitute all symbols in reel with given symbol with delay between
        for (let i = this.finalSymbols.length - 1; i >= 0; i--) {
            // Skip already placed symbol
            if (this.finalSymbols[i].symbolNum === symbolNum) continue;

            await (() => {
                return new Promise(resolve => {
                    this.finalSymbols[i].changeSymbol(symbolNum);
                    setTimeout(() => {
                        resolve();
                    }, 500);
                });
            })();
        }

        return new Promise(resolve => resolve());
    }

    /**
     * Add symbols to reel
     * @param {Array<Symbol>} symbolsArr Array of Symbols to add to reel
     */
    addSymbols(symbolsArr) {
        for (let i = symbolsArr.length - 1; i >= 0; i--) {
            const symbol = symbolsArr[i];
            this.reelNode.insertBefore(symbol.node, this.reelNode.firstChild);
        }
    }

    resetReel() {
        // Remove useless symbols
        while (this.reelNode.childNodes.length !== settings.numOfRows) {
            this.reelNode.removeChild(this.reelNode.childNodes[settings.numOfRows]);
        }

        // Remove spin animation time to move reel
        this.reelNode.style.transitionDuration = '0ms';
        // Set reel in default position
        this.reelNode.style.transform = '';

        // Set spin animation time back
        setTimeout(() => {
            // Reset spin duration
            this.reelNode.style.transitionDuration = `${settings.spinAnimationTimeInMs}ms`;
        }, 0);
    }
}
