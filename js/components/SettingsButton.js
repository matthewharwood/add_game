class SettingsButton extends HTMLElement {
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

customElements.define('settings-button', SettingsButton);

export default SettingsButton;
