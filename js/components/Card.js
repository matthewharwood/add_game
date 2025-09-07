class Card extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.velocityX = 0;
    this.lastX = 0;
    this.originalParent = null;
    this.originalIndex = null;
  }

  connectedCallback() {
    this.render();
    this.setupDragHandlers();
  }

  setupDragHandlers() {
    const isOperator = this.classList.contains('operator-card');
    if (isOperator) return; // Operator cards are not draggable
    
    // Make card draggable
    this.style.cursor = 'grab';
    this.style.touchAction = 'none';
    this.style.userSelect = 'none';
    
    // Pointer events for unified mouse/touch handling
    this.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    this.addEventListener('pointermove', this.handlePointerMove.bind(this));
    this.addEventListener('pointerup', this.handlePointerUp.bind(this));
    this.addEventListener('pointercancel', this.handlePointerUp.bind(this));
  }

  handlePointerDown(e) {
    if (this.classList.contains('operator-card')) return;
    
    // Capture pointer for smooth dragging
    this.setPointerCapture(e.pointerId);
    
    // Store original position and parent
    this.originalParent = this.parentElement;
    this.originalIndex = Array.from(this.originalParent.children).indexOf(this);
    
    // Store nav slot index if coming from bottom nav
    if (this.originalParent.classList.contains('nav-card-slot')) {
      this.originalNavSlot = this.originalParent;
    } else {
      this.originalNavSlot = null;
    }
    
    const rect = this.getBoundingClientRect();
    this.startX = e.clientX - rect.left;
    this.startY = e.clientY - rect.top;
    this.lastX = e.clientX;
    
    // Set dragging state
    this.isDragging = true;
    this.classList.add('dragging');
    this.style.cursor = 'grabbing';
    
    // Move to document body for free movement
    this.style.position = 'fixed';
    this.style.zIndex = '9999';
    this.style.left = `${rect.left}px`;
    this.style.top = `${rect.top}px`;
    this.style.width = `${rect.width}px`;
    this.style.height = `${rect.height}px`;
    document.body.appendChild(this);
    
    // Dispatch drag start event
    this.dispatchEvent(new CustomEvent('dragstart', {
      bubbles: true,
      detail: { card: this, x: e.clientX, y: e.clientY }
    }));
    
    e.preventDefault();
  }

  handlePointerMove(e) {
    if (!this.isDragging) return;
    
    // Calculate new position
    this.currentX = e.clientX - this.startX;
    this.currentY = e.clientY - this.startY;
    
    // Calculate velocity for rotation effect
    this.velocityX = e.clientX - this.lastX;
    this.lastX = e.clientX;
    
    // Apply position with transform for better performance
    this.style.left = `${this.currentX}px`;
    this.style.top = `${this.currentY}px`;
    
    // Dynamic rotation based on velocity
    const rotation = Math.max(-15, Math.min(15, this.velocityX * 0.5));
    this.style.setProperty('--drag-rotation', `${rotation}deg`);
    
    // Check for drop targets
    const dropTarget = this.findDropTarget(e.clientX, e.clientY);
    this.updateDropPreview(dropTarget);
    
    // Dispatch drag move event
    this.dispatchEvent(new CustomEvent('dragmove', {
      bubbles: true,
      detail: { card: this, x: e.clientX, y: e.clientY, dropTarget }
    }));
  }

  handlePointerUp(e) {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.classList.remove('dragging');
    this.style.cursor = 'grab';
    this.style.setProperty('--drag-rotation', '0deg');
    
    // Find drop target
    const dropTarget = this.findDropTarget(e.clientX, e.clientY);
    
    if (dropTarget && dropTarget.canAcceptCard && dropTarget.canAcceptCard(this)) {
      // Successful drop
      this.dropIntoTarget(dropTarget);
    } else {
      // Return to original position
      this.returnToOriginal();
    }
    
    // Release pointer capture
    this.releasePointerCapture(e.pointerId);
    
    // Dispatch drag end event
    this.dispatchEvent(new CustomEvent('dragend', {
      bubbles: true,
      detail: { card: this, dropTarget }
    }));
  }

  findDropTarget(x, y) {
    // Temporarily hide this card to check elements underneath
    this.style.pointerEvents = 'none';
    const elementBelow = document.elementFromPoint(x, y);
    this.style.pointerEvents = 'auto';
    
    // Check if it's a card slot or bottom nav
    if (elementBelow) {
      const slot = elementBelow.closest('game-card-slot');
      const bottomNav = elementBelow.closest('bottom-nav-container');
      
      if (slot) return slot;
      if (bottomNav) return bottomNav;
      
      // Check shadow roots
      const shadowHost = elementBelow.getRootNode().host;
      if (shadowHost && shadowHost.tagName === 'GAME-CARD-SLOT') {
        return shadowHost;
      }
    }
    
    return null;
  }

  updateDropPreview(dropTarget) {
    // Remove all preview states
    document.querySelectorAll('game-card-slot').forEach(slot => {
      slot.classList.remove('drop-preview');
    });
    
    // Add preview to current target
    if (dropTarget && dropTarget.tagName === 'GAME-CARD-SLOT') {
      dropTarget.classList.add('drop-preview');
    }
  }

  async dropIntoTarget(target) {
    const { animate } = await import('animejs');
    
    // Handle different target types
    if (target.tagName === 'GAME-CARD-SLOT') {
      // Dropping into a slot
      const existingCard = target.querySelector('game-card:not(.operator-card)');
      if (existingCard) {
        // Swap cards - move existing card back to original parent
        this.originalParent.appendChild(existingCard);
      }
      
      // Get slot position
      const slotRect = target.getBoundingClientRect();
      const cardRect = this.getBoundingClientRect();
      
      // Animate to slot position
      animate(this, {
        left: slotRect.left + (slotRect.width - cardRect.width) / 2,
        top: slotRect.top + (slotRect.height - cardRect.height) / 2,
        scale: [1.08, 1],
        duration: 300,
        ease: 'outCubic',
        complete: () => {
          // Reset styles and append to slot
          this.style.position = '';
          this.style.left = '';
          this.style.top = '';
          this.style.width = '';
          this.style.height = '';
          this.style.zIndex = '';
          target.appendChild(this);
          
          // Update question array
          const slotIndex = parseInt(target.getAttribute('slot-index'));
          const cardValue = parseInt(this.textContent);
          if (!isNaN(slotIndex) && !isNaN(cardValue)) {
            window.dispatchEvent(new CustomEvent('card-placed', {
              detail: { slotIndex, value: cardValue }
            }));
          }
        }
      });
    } else if (target.tagName === 'BOTTOM-NAV-CONTAINER') {
      // Dropping back to bottom nav - find the best slot
      const navContent = target.shadowRoot.querySelector('.nav-content');
      
      // Try to return to original nav slot if available
      let targetSlot = this.originalNavSlot;
      
      // If original slot is occupied or we don't have one, find an empty slot
      if (!targetSlot || targetSlot.querySelector('game-card')) {
        const emptySlot = navContent.querySelector('.nav-card-slot:empty');
        if (emptySlot) {
          targetSlot = emptySlot;
        } else {
          // No empty slots, return to original position
          this.returnToOriginal();
          return;
        }
      }
      
      const slotRect = targetSlot.getBoundingClientRect();
      
      // Animate to nav slot position
      animate(this, {
        left: slotRect.left + (slotRect.width - this.getBoundingClientRect().width) / 2,
        top: slotRect.top + (slotRect.height - this.getBoundingClientRect().height) / 2,
        scale: [1.08, 1],
        duration: 300,
        ease: 'outCubic',
        complete: () => {
          // Reset styles and append to nav slot
          this.style.position = '';
          this.style.left = '';
          this.style.top = '';
          this.style.width = '';
          this.style.height = '';
          this.style.zIndex = '';
          targetSlot.appendChild(this);
          
          // Clear from question array if it was in a game slot
          const previousSlot = this.originalParent;
          if (previousSlot && previousSlot.tagName === 'GAME-CARD-SLOT') {
            const slotIndex = parseInt(previousSlot.getAttribute('slot-index'));
            if (!isNaN(slotIndex)) {
              window.dispatchEvent(new CustomEvent('card-removed', {
                detail: { slotIndex }
              }));
            }
          }
        }
      });
    }
  }

  async returnToOriginal() {
    const { animate } = await import('animejs');
    
    // Get original parent position
    const parentRect = this.originalParent.getBoundingClientRect();
    const cardRect = this.getBoundingClientRect();
    
    // Animate back to original position
    animate(this, {
      left: parentRect.left,
      top: parentRect.top,
      scale: [1, 1],
      rotate: 0,
      duration: 300,
      ease: 'outCubic',
      complete: () => {
        // Reset all styles
        this.style.position = '';
        this.style.left = '';
        this.style.top = '';
        this.style.width = '';
        this.style.height = '';
        this.style.zIndex = '';
        
        // Return to original parent at original index
        if (this.originalIndex >= this.originalParent.children.length) {
          this.originalParent.appendChild(this);
        } else {
          this.originalParent.insertBefore(this, this.originalParent.children[this.originalIndex]);
        }
      }
    });
  }

  render() {
    const isOperator = this.classList.contains('operator-card');
    const operatorType = this.getAttribute('data-operator');
    const content = this.textContent || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          will-change: transform, box-shadow;
        }
        
        /* Dragging state styles */
        :host(.dragging) {
          opacity: 0.9;
          filter: saturate(1.2);
        }
        
        :host(.dragging) .card {
          transform: scale(1.08) rotate(var(--drag-rotation, 0deg));
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          border-color: var(--color-accent-primary) !important;
          outline: 2px solid var(--color-accent-primary);
          outline-offset: 2px;
        }

        .card {
          width: 100%;
          height: 100%;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          cursor: inherit;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                      box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      border-radius 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        /* Hover state (not during drag) */
        :host(:not(.dragging):not(.operator-card):hover) .card {
          transform: translateY(-2px) rotate(5deg);
          box-shadow: var(--shadow-lg);
        }
        
        /* Active/Press state */
        :host(:not(.dragging):not(.operator-card):active) .card {
          transform: scale(0.98) rotate(5deg);
          border-radius: 12px;
        }

        /* Regular card styles */
        .card:not(.operator) {
          background: var(--gradient-primary);
          color: var(--color-text-inverse);
          border: 2px solid var(--color-border-default);
        }

        .card:not(.operator):hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        /* Operator card styles */
        .card.operator {
          background: var(--color-bg-tertiary);
          border: 2px solid var(--color-accent-primary);
          color: var(--color-accent-primary);
          position: relative;
        }

        .card.operator::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            transparent 30%,
            rgba(127, 219, 202, 0.1) 50%,
            transparent 70%
          );
          pointer-events: none;
        }

        .card.operator[data-operator="add"] {
          font-size: 3rem;
          font-family: var(--font-mono);
        }

        .card.operator[data-operator="equals"] {
          font-size: 3rem;
          font-family: var(--font-mono);
        }


        /* Number display */
        .card-value {
          font-size: 2rem;
          font-family: var(--font-mono);
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* Operator display */
        .operator-symbol {
          font-size: 3rem;
          font-family: var(--font-mono);
          text-shadow: 0 2px 8px rgba(127, 219, 202, 0.4);
          position: relative;
          z-index: 1;
        }
      </style>

      <div class="card ${isOperator ? 'operator' : ''}" ${operatorType ? `data-operator="${operatorType}"` : ''}>
        ${isOperator 
          ? `<span class="operator-symbol">${content}</span>` 
          : `<span class="card-value">${content}</span>`
        }
      </div>
    `;
  }
}

customElements.define('game-card', Card);

export default Card;
