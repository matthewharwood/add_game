import { Game, updateEnemy } from '../services/storage.js';
import { findClosestEnemyByLevel } from '../utils/enemyMatcher.js';

class EnemyContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    try {
      // Find the closest enemy based on the current game level
      const currentLevel = Game.level || 1;
      const matchedEnemy = findClosestEnemyByLevel(currentLevel);
      console.log('Matched enemy for level', currentLevel, ':', matchedEnemy);

      // Update the enemy in storage
      await updateEnemy(matchedEnemy);
      
      // Use the enemy from Game state (which includes currentHealth)
      this.currentEnemy = Game.enemy;
      this.render();
    } catch (error) {
      console.error('Failed to initialize enemy:', error);
      // Optionally render an error state or fallback UI
      this.renderError(error.message);
    }
  }
  
  renderError(message) {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          grid-row: 1 / 3;
          grid-column: 3 / 7;
          padding: 24px 0 0 0;
          box-sizing: border-box;
        }
        .error-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--color-bg-secondary);
          border: 2px solid var(--color-error);
          border-radius: 8px;
          color: var(--color-error);
          font-size: 1.2rem;
          padding: 2rem;
          text-align: center;
        }
      </style>
      <div class="error-container">
        <div>⚠️ ${message}</div>
      </div>
    `;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import url('/css/variables.css');

        :host {
          display: block;
          grid-row: 1 / 3;
          grid-column: 3 / 7;
          padding: 24px 0 0 0;
          box-sizing: border-box;
        }

        .enemy-wrapper {
          width: 100%;
          height: 100%;
          border: 2px solid var(--color-border-default);
          border-radius: 8px;
          background-color: var(--color-bg-secondary);
          box-shadow: var(--shadow-md);
          box-sizing: border-box;
        }


        .flex-top-grid {
            flex-direction: row;
            display: flex;
            width: 100%;
            height: 90%;
        }
        .enemy-portrait {
            width: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            box-sizing: border-box;
        }

        .enemy-portrait img {
            width: 100%;
            height: 100%;

            aspect-ratio: 1 / 1;
            object-fit: contain;
        }
        .enemy-info {
            width: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            box-sizing: border-box;
        }

        .enemy-name {
            font-family: var(--font-display);
            font-weight: 700;
            font-style: normal;
            font-size: 2.5rem;
            color: var(--color-text-primary);
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        .enemy-health {
            height: 10%;
            width: 100%;
            display: flex;
            align-items: center;
            box-sizing: border-box;
        }

        .health-bar-container {
            width: 100%;
            height: 100%;
            background-color: var(--color-bg-tertiary);
            overflow: hidden;
            position: relative;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .health-bar-fill {
            width: 100%;
            height: 100%;
            background: var(--gradient-success);
            transition: width 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .health-bar-fill::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
                180deg,
                rgba(255, 255, 255, 0.3) 0%,
                transparent 50%,
                rgba(0, 0, 0, 0.2) 100%
            );
        }

        .health-text {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-text-inverse);
            font-weight: bold;
            font-size: 0.9rem;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
            z-index: 1;
        }

        /* Tablet Styles */
        @media (max-width: 1024px) and (min-width: 769px) {
          :host {
            grid-row: 1 / 2;
            grid-column: 2 / 5;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          :host {
            grid-row: 1 / 3;
            grid-column: 1 / 6;
          }
        }
      </style>
      <div class="enemy-wrapper">

            <div class="flex-top-grid">
              <div class="enemy-portrait">
                ${this.currentEnemy ? `<img src="${this.currentEnemy.imgsrc}" alt="${this.currentEnemy.name}" />` : ''}
              </div>
              <div class="enemy-info">
                ${this.currentEnemy ? `<span class="enemy-name">${this.currentEnemy.name}</span>` : ''}
              </div>
            </div>

            <div class="enemy-health">
              <div class="health-bar-container">
                <div class="health-bar-fill" style="width: ${this.currentEnemy ? `${(this.currentEnemy.currentHealth / this.currentEnemy.maxHealth) * 100}%` : '100%'}"></div>
                <div class="health-text">
                  ${this.currentEnemy ? `${this.currentEnemy.currentHealth} / ${this.currentEnemy.maxHealth}` : ''}
                </div>
              </div>
            </div>

      </div>
    `;
  }
}

customElements.define('enemy-container', EnemyContainer);

export default EnemyContainer;
