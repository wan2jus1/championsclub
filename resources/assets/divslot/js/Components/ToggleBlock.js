import { transitionEnd } from './../events';

class ToggleBlock {
    constructor(options, props) {
        this.props = props;

        this.node = options.node;
        this.isToggled = false;

        this.itemsNodes = [];
        this.activeItem;

        this.init(options);
    }

    init(options) {
        const blockContent = this.node.querySelector('.content');

        const reversedItems = options.items.slice().reverse();

        // Fill block content with appropriate items
        reversedItems.forEach(value => {
            // Init element properties
            const item = document.createElement('div');
            item.className = 'item';
            item.setAttribute('data-value', value);

            // Place value from options.items to element innerHTML
            item.innerHTML = value;

            this.itemsNodes.push(item);

            // Add item to content element
            blockContent.appendChild(item);
        });

        this._initListeners();
    }

    _initListeners() {
        this.itemsNodes.forEach(item => {
            // Add click event on item
            item.onclick = () => {
                // If there is active item
                if (this.activeItem) {
                    // Remove active highlight
                    this.activeItem.classList.remove('item--active');
                }

                // Add highlight to new item
                item.classList.add('item--active');
                this.props.setValue(item.getAttribute('data-value'));

                // Remember active item
                this.activeItem = item;

                // Toggle(hide) block itself
                this.toggle();
            }
        });

        this.node.addEventListener(transitionEnd, (event) => {
            if (this.isToggled) {
                this.props.disableInterface();
                this.props.enableSelf();
            } else {
                // If block is sparred
                event.target.style.display = '';
                // After toggling enable interface
                this.props.setInterfaceIdle();
            }
        });
    }

    toggle() {
        if (this.isToggled) {
            this.node.style.transform = `translateY(50px)`;
            this.isToggled = false;
        } else {
            this.node.style.display = `block`;
            this.node.style.transform = `translateY(-${this.node.offsetHeight}px)`;
            this.isToggled = true;

        }
        // Disable interface while toggling
        this.props.disableInterface();
    }
}

export default ToggleBlock;