import APIController from './../Controllers/APIController';
import GambleModalButton from './buttons/GambleModalButton';
import {capitalize} from './../Helpers/stringHelper';

export default class GambleModal {
    constructor(props) {
        this.props = props;
        this.node = this.props.node;

        this.isOn = false;

        this.bigCardNode;

        this.previousCards = {
            node: this.node.querySelector('#previousCardsSuits'),
            add(cardSuit) {
                // Add to markup
                const cardToInsert = document.createElement('div');
                cardToInsert.className = `suit-${cardSuit}`;
                this.node.appendChild(cardToInsert);
            },
            removeOldest() {
                // Remove oldest card from html markup
                this.node.removeChild(this.node.children[0]);
            }
        }

        const redOverlayColor = 'rgba(255,0,0,0.3)';
        const blueOverlayColor = 'rgba(0,0,255,0.3)';

        // TODO: Handle if gamble is extended
        // Init gamble modal btns depending on extended gamble or not
        if (settings.gambleExtended) {
            this.btns = {
                red: new GambleModalButton({
                    node: this.node.querySelector('#red'),
                    onClick: this.props.pickSuit('red'),
                    overlayColor: redOverlayColor
                }),
                heart: new GambleModalButton({
                    node: this.node.querySelector('#heart'),
                    onClick: this.props.pickSuit('heart'),
                    overlayColor: redOverlayColor
                }),
                diamond: new GambleModalButton({
                    node: this.node.querySelector('#diamond'),
                    onClick: this.props.pickSuit('diamond'),
                    overlayColor: redOverlayColor
                }),
                black: new GambleModalButton({
                    node: this.node.querySelector('#black'),
                    onClick: this.props.pickSuit('black'),
                    overlayColor: blueOverlayColor
                }),
                club: new GambleModalButton({
                    node: this.node.querySelector('#club'),
                    onClick: this.props.pickSuit('club'),
                    overlayColor: blueOverlayColor
                }),
                spade: new GambleModalButton({
                    node: this.node.querySelector('#spade'),
                    onClick: this.props.pickSuit('spade'),
                    overlayColor: blueOverlayColor
                }),
            };
        } else {
            this.btns = {
                red: new GambleModalButton({
                    node: this.node.querySelector('#red'),
                    onClick: this.props.pickSuit('red'),
                    overlayColor: redOverlayColor
                }),
                black: new GambleModalButton({
                    node: this.node.querySelector('#black'),
                    onClick: this.props.pickSuit('black'),
                    overlayColor: blueOverlayColor
                })
            };
        }

        this._initializePreviousCards();
    }

    _initializePreviousCards() {
        const cardsSuits = [
            'heart',
            'diamond',
            'club',
            'spade'
        ];

        // Randomize initial previous cards
        for (let i = 0; i < settings.gamblePreviousCardsAmount; i++) {
            const randomedCardSuitIndex = Math.floor(Math.random() * cardsSuits.length);
            this.previousCards.add(cardsSuits[randomedCardSuitIndex]);
        }
    }

    show() {
        this.isOn = true;
        this.node.style.display = 'block';
    }

    hide() {
        this.isOn = false;
        this.node.style.display = 'none';
    }

    disableBtns() {
        // Disable modal btns
        Object.keys(this.btns).forEach(btn => this.btns[btn].disable());

        // Also disable panel btns
        this.props.disablePanelGambleBtns();
    }

    enableBtns() {
        // Enable modal btns
        Object.keys(this.btns).forEach(btn => this.btns[btn].enable());

        // Also enable panel btns
        this.props.enablePanelGambleBtns();
    }

    showDroppedCard(randomSuit) {
        // Change flipping card suit
        this.bigCardNode.style.zIndex = 1;

        // Add randomed card to previous cards
        this.previousCards.add(randomSuit);
    }

    hideDroppedCard() {
        // Remove oldest previous card
        this.previousCards.removeOldest();

        // Start flipping card
        this.bigCardNode.style.zIndex = '';
    }

    pickCard = async (cardSuit) => {
        // Disable gamble btns
        this.disableBtns();

        // Get response from server
        // const gambleResponse = await this.getGambleResponse(cardSuit);
        const gambleResponse = await APIController.getGambleData(cardSuit);

        this.bigCardNode = this.node.querySelector(`#suit${capitalize(gambleResponse.rand_card)}`);
        // Show randomed card in big card and add to previous cards
        this.showDroppedCard(gambleResponse.rand_card);

        if (gambleResponse.won) {
            // Update win field from Game
            this.props.gambleWin(gambleResponse.won_coins);

            // After delay setup gamble to one more pick
            setTimeout(() => {
                this.hideDroppedCard();

                this.setValues(gambleResponse.won_coins);

                // Enable gamble btns
                this.enableBtns();

                this.props.gambleReadyToPick();

            }, 1500);
        } else {
            this.props.gambleLose();

            this.setValues(0);

            setTimeout(() => {
                this.hideDroppedCard();

                // Start flipping card
                this.bigCardNode.style.zIndex = '';

                this.props.gambleOver();
            }, 1500);
        }
    }

    /**
     * Start gamble
     * @param {Number} currentWin Current user win points
     */
    start(currentWin) {
        this.props.gambleReadyToPick();

        // Enable gamble buttons
        this.enableBtns();

        // Set gamble values
        this.setValues(currentWin);

        // Show modal
        this.show();
    }

    setValues(points) {
        const amountField     = document.querySelector('#gameAmountValue');
        const winByColorField = document.querySelector('#gambleToWinColor');
        const winBySuitField  = document.querySelector('#gambleToWinSuit');

        if (amountField) amountField.innerText         = points;
        if (winByColorField) winByColorField.innerText = points * 2;
        if (winBySuitField) winBySuitField.innerText   = points * 4;
    }
}
