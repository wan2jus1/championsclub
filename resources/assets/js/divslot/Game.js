import {getNextArrayItem, getMultiplyNearestLowerNumbers} from './Helpers/arrayHelp';
import PointsController from './Controllers/PointsController';
import ReelsController from './Controllers/ReelsController';
import LinesController from './Controllers/LinesController';
import InterfaceController from './Controllers/InterfaceController';

import {freeSpin as mockResponseFreeSpin} from './spinMockup';

import axios from 'axios';

export default class Game {
    constructor(gameName) {
        this.gameName = gameName;
        this.gameNode = document.querySelector('#game');

        // Store for spin response data
        this.spinResponse = {};

        // Store for bonus spins
        this.bonusSpins = {
            on: false,
            spins: [],
            currentSpinIndex: 0,
            totalSpins: 0
        };

        // Flag for check if auto spins in turned on
        this.autoSpinIsOn = false;

        this.reelsController = new ReelsController(
            document.querySelector('#reels_wrapper'),
            { reelsHasStopped: this.reelsHasStopped }
        );

        this.linesController = new LinesController(
            document.querySelector('#reels_container'),
            { reels: this.reelsController.reels }
        );

        this.interfaceController = new InterfaceController({
            containerNode: document.querySelector('#reels_wrapper'),
            lines: this.linesController.lines,
            spinReels: this.spin,
            stopReels: this.stop,
            takeWin: this.takeWinClickHandler,
            speedUpTakeWin: this.speedUpTakeWin,
            autoSpin: this.autoSpin,
            stopAutoSpinning: this.stopAutoSpinning,
            setDenomination: this.setDenomination,
            setLines: this.setLines,
            setBerPerLine: this.setBerPerLine,
            setMaxBet: this.setMaxBet,
            startGamble: this.startGamble
        });

        this.interfaceController.panel.notifier.text = 'Loading...';
        (async () => {
            // Load some necessarily information, use it
            const playerData = await this.getPlayerData();
            const userCash = +playerData.cash;

            this.pointsController = new PointsController({
                panel: this.interfaceController.panel,
                linePresenters: this.interfaceController.linePresenters,
                linesBlock: this.interfaceController.linesBlock,
                betPerLineBlock: this.interfaceController.betPerLineBlock,
                denominationBlock: this.interfaceController.denominationBlock,
            }, {
                userCash: userCash,
                denomination: 0.01,
                lines: 1,
                betPerLine: 1,
            });

            // And enable game to play
            this.interfaceController.setIdle();
            this.interfaceController.panel.notifier.text = 'Press start to spin';

            // Remove preloader
            window.onGameLoaded();
        })();
    }

    setMaxBet = () => {
        // Get lines and betPerLine values for max possible bet depending on user's cash
        const maxBetVars = getMultiplyNearestLowerNumbers(this.pointsController.userCashInPoints, settings.lines, settings.betPerLine);

        this.setLines(maxBetVars.firstNumber);
        this.setBerPerLine(maxBetVars.secondNumber);
    }

    setBerPerLine = newBetPerLine => this.setBetRelatedValue(settings.betPerLine, this.pointsController.betPerLine, this.pointsController.setBetPerLine)(newBetPerLine);
    setDenomination = newDenom => this.setBetRelatedValue(settings.denominations, this.pointsController.denomination, this.pointsController.setDenomination)(newDenom);

    setBetRelatedValue = (array, currentValue, setNewValue) => {
        return value => {
            const newValue = value ? value : getNextArrayItem(array, currentValue);
            setNewValue.call(null, newValue);
            this.setSpinPossibility();
        }
    }

    setLines = newLines => {
        const newValue = newLines ? newLines : getNextArrayItem(settings.lines, this.pointsController.lines);
        this.pointsController.setLines(newValue);

        this.setSpinPossibility();

        this.linesController.showAndHideLines(newValue);
    }

    // Disables/enables spin possibility depending on user's bet/cash
    setSpinPossibility = () => {
        if (this.pointsController.totalBet > this.pointsController.userCashInPoints) {
            this.interfaceController.panel.notifier.text = 'Not enough cash for this bet';
            this.interfaceController.disableSpinAndAuto();
        } else {
            this.interfaceController.panel.notifier.text = 'Press start to spin';
            this.interfaceController.enableSpinAndAuto();
        }
    }

    getPlayerData = async () => {
        try {
            return (await axios.post('http://admin.chcgreen.org/getplayerinfo')).data;
        } catch(err) {
            console.log(err);
        }
    }

    // Getting spin data
    getSpinResponse = async () => {
        try {
            const response = await axios.post('http://admin.chcgreen.org/spin', {
                lines_amount: this.pointsController.lines,
                bet_per_line: this.pointsController.betPerLine,
                denomination: this.pointsController.denomination * 100,
                game: this.gameName
            });

            return response.data;
        } catch(err) {
            console.log(err);
            return mockResponseFreeSpin;
        }
    }

    takeWinClickHandler = async () => {
        this.interfaceController.disableInterface();

        // FIXME: Rethink about it
        if (this.interfaceController.alertWindow.isOn)
            this.interfaceController.hideAlert();

        // Wait transfering win
        await this.transferWin();

        // After transfering win enable interface
        this.interfaceController.enableInterface();
        this.setSpinPossibility();
    }

    transferWin = async () => {
        // Enable transfer win speed up
        this.interfaceController.enableSpeedUpTransferWin();

        // Remember previous win before transfering it to user's cash
        const previousWin = this.pointsController.userWin;

        // Wait until all win points will be transfered to user's cash
        await this.pointsController.transferWinToCash();

        // Disable transfer speed up if money already transfered
        this.interfaceController.disableSpeedUpTransferWin();

        // Unblur symbols after win points are transfered
        this.linesController.unblurAllSymbols();

        // Set previous win in win block
        this.pointsController.previousWin = previousWin;

        return new Promise(resolve => resolve());
    }

    // Increase transfering speed
    speedUpTakeWin = () => {
        this.pointsController.speedUpTransfer();
        this.interfaceController.disableSpeedUpTransferWin();
    }

    startGamble = () => {
        console.log('Start gamble');

        // Set interface to gamble 'state'
        this.interfaceController.setGamble();

        // TODO:
    }

    

    spin = () => {
        // FIXME: Rethink about it
        if (this.interfaceController.alertWindow.isOn) {
            console.log('Hide bonus spins result alert');
            this.interfaceController.hideAlert();

            return;
        }

        if (this.bonusSpins.on) {
            console.log('Bonus spins starts');

            // Hide alert when bonus spins starts
            this.interfaceController.hideAlert();

            this.interfaceController.disableInterface();

            // Start bonus spin
            this.bonusSpin();
        } else {
            console.log('Normal spin');

            this.getDataAndSpin();
        }
    }

    getDataAndSpin = () => {
        this.interfaceController.panel.notifier.text = 'Fetching data...';
        // Disable whole interface
        this.interfaceController.disableInterface();

        // Enable auto btn if auto spins is on
        if (this.autoSpinIsOn) this.interfaceController.enableAuto();

        this.getSpinResponse().then(result => {
            console.log(result);
            this.spinResponse = result;

            // If bonus spins dropped
            if (this.spinResponse.bonus_spins) {
                // Init bonus spins vars
                this.bonusSpins.on = true;
                this.bonusSpins.spins = this.spinResponse.bonus_spins.spins;
                this.bonusSpins.currentSpinIndex = 0;
                this.bonusSpins.totalSpins = this.spinResponse.bonus_spins.spins.length;
            }

            // Decrease user cash
            this.pointsController.userCash -= this.pointsController.pointsToCoins(this.pointsController.totalBet);

            // Clear notifier
            this.interfaceController.panel.notifier.clear();

            // Stop showing win lines
            this.linesController.stopCyclingWinningLines();

            // Spin reels to given final symbols
            this.startReels(this.spinResponse.final_symbols);
        });
    }

    autoSpin = () => {
        // If no auto spin, turn it on
        if (!this.autoSpinIsOn) this.autoSpinIsOn = true;

        // Start normal spin
        this.getDataAndSpin();
    }

    stopAutoSpinning = () => {
        this.autoSpinIsOn = false;
    }

    bonusSpin = () => {
        this.bonusSpins.currentSpinIndex++;

        this.interfaceController.panel.notifier.text = `Free spin #${this.bonusSpins.currentSpinIndex}`;

        // Spin reels to given final symbols
        this.startReels(this.bonusSpins.spins[this.bonusSpins.currentSpinIndex - 1].final_symbols);
    }

    /**
     * Start reels
     * @param {Array<Number>} finalSymbols Two dimensional array of final symbol
     */
    startReels(finalSymbols) {
        // Hide all lines
        this.linesController.hideAllLines();

        this.reelsController.startReels(finalSymbols);

        // Enable stop
        this.interfaceController.enableStop();
    }

    stop = () => {
        this.interfaceController.disableStop();

        this.reelsController.stopReels();
    }

    // All reels has stopped event
    reelsHasStopped = async () => {
        this.interfaceController.disableStop();

        // Checking is there bonus spins
        if (this.bonusSpins.on) {
            // If bonus spins dropped
            if (this.bonusSpins.currentSpinIndex === 0) {
                this.bonusSpins.on = true;

                // Show win lines and transfer win from regular spin
                await this.linesController.showWinningLines(this.spinResponse.spin_result, winCashInLine => {
                    this.pointsController.userWin += winCashInLine;
                    this.interfaceController.panel.notifier.text = `You won ${this.pointsController.userWin} points`;
                });

                // Show alert and wait for user to press start btn
                this.interfaceController.showAlert(`You won ${this.bonusSpins.totalSpins} bonus spins`);

                // Transfer user regular spin win
                await this.transferWin();

                this.interfaceController.panel.notifier.text = `You won ${this.bonusSpins.totalSpins} free spins`;

                // Enable spin btn to start bonus spins
                this.interfaceController.enableSpin();

                return;
            }

            const previousBonusSpin = this.bonusSpins.spins[this.bonusSpins.currentSpinIndex - 1];
            // If user won on bonus spin
            if (previousBonusSpin.won) {
                // Show win lines and transfer win from regular spin
                await this.linesController.showWinningLines(previousBonusSpin.spin_result, winCashInLine => {
                    this.pointsController.userWin += winCashInLine;
                    this.interfaceController.panel.notifier.text = `You won ${this.pointsController.userWin} points`;
                });
            }

            // If no more bonus spins
            if (this.bonusSpins.currentSpinIndex === this.bonusSpins.totalSpins) {
                this.interfaceController.panel.notifier.text = `Free spins ended. You won ${this.pointsController.userWin} points`;

                // Show alert
                this.interfaceController.showAlert(`Free spins ended, you won ${this.pointsController.userWin} points in ${this.bonusSpins.totalSpins} spins`);

                // Tun off bonus spins
                this.bonusSpins.on = false;

                // Check if user won
                if (this.pointsController.userWin > 0) {
                    // If user won something
                    this.interfaceController.setTakeWin();
                } else {
                    // If no win at all
                    this.interfaceController.enableInterface();
                    this.setSpinPossibility();
                }

                return;
            }

            // Spin bonus spin
            this.bonusSpin();

            return;
        }

        // Spin ended
        if (this.spinResponse.won) { // Win case
            // Show all winning lines
            // and update user win line by line in callback
            await this.linesController.showWinningLines(this.spinResponse.spin_result, winCashInLine => {
                this.pointsController.userWin += winCashInLine;
                this.interfaceController.panel.notifier.text = `You won ${this.pointsController.userWin} points`;
            });

            if (this.autoSpinIsOn) {
                // Transfer user regular spin win
                await this.transferWin();

                // If auto spins was disabled while transfering money
                if (!this.autoSpinIsOn) {
                    this.interfaceController.enableInterface();
                    this.setSpinPossibility();
                } else {
                    this.autoSpin();
                }

                return;
            }

            // Enable possibility to take win or gamble
            this.interfaceController.setTakeWin();
            this.interfaceController.panel.notifier.text = 'Take win or gamble';

            this.linesController.cycleShowingWinningLines();
        } else { // Lose case
            // Reset userWin block after
            this.pointsController.userWin = 0;

            // If auto spin enabled
            if (this.autoSpinIsOn) {
                this.autoSpin();

                return;
            }

            this.interfaceController.enableInterface();
            this.setSpinPossibility();
        }

    }

}
