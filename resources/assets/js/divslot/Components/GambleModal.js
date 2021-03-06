import APIController from './../Controllers/APIController';
import GambleModalButton from './buttons/GambleModalButton';
import { capitalize } from './../Helpers/stringHelper';
import Translator from '../Translator';
import TitleValue from './TitleValue';
import { transitionEnd } from '../events';
import { raf } from './../Helpers/windowHelper';

class PreviousCards {
    constructor(node) {
        this.node = node;
        this.titleNode = this.node.querySelector('.title');
        this.suitsNode = this.node.querySelector('.suits');

        this.title = Translator.get('previousCards');
    }

    set title(title) {
        if (this.titleNode) this.titleNode.innerText = title;
    }

    // Add to markup
    add(cardSuit) {
        const cardToInsert = document.createElement('div');
        cardToInsert.className = `suit-${cardSuit}`;
        this.suitsNode.appendChild(cardToInsert);
    }

    // Remove oldest card from html markup
    removeOldest() {
        this.suitsNode.removeChild(this.suitsNode.children[0]);
    }
}

export default class GambleModal {
    constructor(props) {
        this.props = props;
        this.node = this.props.node;

        this.isOn = false;

        this.bigCardNode;

        this.valuesFields = {
            amount: new TitleValue({
                node: this.node.querySelector('#gambleAmount'),
                title: Translator.get('gambleAmount')
            }),
            toWinColor: new TitleValue({
                node: this.node.querySelector('#gambleToWinColor'),
                title: Translator.get('colorGambleToWin')
            })
        }

        // Init previous cards
        this.previousCards = new PreviousCards(this.node.querySelector('#previousCards'));

        // Init color btns
        this.btns = {
            red: new GambleModalButton({
                node: this.node.querySelector('#red'),
                onClick: this.props.pickSuit('red'),
                overlayClass: 'red',
                title: Translator.get('red')
            }),
            black: new GambleModalButton({
                node: this.node.querySelector('#black'),
                onClick: this.props.pickSuit('black'),
                overlayClass: 'black',
                title: Translator.get('black')
            })
        }

        // If gamble is extended
        if (settings.gambleExtended) {
            const suitBtns = {
                heart: new GambleModalButton({
                    node: this.node.querySelector('#heart'),
                    onClick: this.props.pickSuit('heart'),
                    overlayClass: 'red'
                }),
                diamond: new GambleModalButton({
                    node: this.node.querySelector('#diamond'),
                    onClick: this.props.pickSuit('diamond'),
                    overlayClass: 'red'
                }),
                club: new GambleModalButton({
                    node: this.node.querySelector('#club'),
                    onClick: this.props.pickSuit('club'),
                    overlayClass: 'black'
                }),
                spade: new GambleModalButton({
                    node: this.node.querySelector('#spade'),
                    onClick: this.props.pickSuit('spade'),
                    overlayClass: 'black'
                }),
            }

            // Add suit buttons to btns store
            Object.assign(this.btns, suitBtns);

            const toWinSuitField = {
                toWinSuit: new TitleValue({
                    node: this.node.querySelector('#gambleToWinSuit'),
                    title: Translator.get('suitGambleToWin')
                })
            };

            // Add more fields to store
            Object.assign(this.valuesFields, toWinSuitField);
        }

        this._initializePreviousCards();
        this._initListeners();
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

        if (settings.backSuitInPreviousCards) {
            // Add suit back card after all
            this.previousCards.add('back');
        }
    }

    _initListeners() {
        this.node.addEventListener(transitionEnd, (event) => {
            // TODO: Enable interface back
            console.log('gamble modal transition done');
        });
    }

    show() {
        this.isOn = true;

        this.node.style.display = 'block';
        // TODO: Disable interface while toggling
        raf(() => this.node.style.transform = 'translateX(0)');
    }

    hide() {
        this.isOn = false;

        this.node.style.display = 'none';
        this.node.style.transform = '';
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

        if (settings.backSuitInPreviousCards) {
            // Add randomed card to previous cards
            const suitBackNode = this.previousCards.node.querySelector('.suit-back');
            // Set suit back card bg ro randomed card
            suitBackNode.className = `suit-${randomSuit}`;
        } else {
            // Add randomed card to previous cards
            this.previousCards.add(randomSuit);
        }
    }

    hideDroppedCard() {
        // Remove oldest previous card
        this.previousCards.removeOldest();

        // Start flipping card
        this.bigCardNode.style.zIndex = '';

        if (settings.backSuitInPreviousCards) {
            // Add suit back card after all
            this.previousCards.add('back');
        }
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
                // Enable gamble btns
                this.enableBtns();
                // Notify interface
                this.props.gambleReadyToPick();
            }, 1500);
        } else {
            this.props.gambleLose();
            this.setValues(0);

            setTimeout(() => {
                this.hideDroppedCard();
                // Start flipping card
                this.bigCardNode.style.zIndex = '';
                // Notify interface
                this.props.gambleOver();
            }, 1500);
        }
    }

    /**
     * Start gamble
     * @param {Number} currentWin Current user win points
     */
    start(currentWin) {
        // Notify interface
        this.props.gambleReadyToPick();
        // Enable gamble buttons
        this.enableBtns();
        // Set gamble values
        this.setValues(currentWin);
        // Show modal
        this.show();
    }

    setValues(points) {
        this.valuesFields.amount.value        = points;
        this.valuesFields.toWinColor.value    = points * 2;
        if (settings.gambleExtended) {
            this.valuesFields.toWinSuit.value = points * 4;
        }
    }
}
