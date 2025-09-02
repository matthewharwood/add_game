class Card extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();

  }



  render() {


  }
}

customElements.define('game-card', Card);

export default Card;
