import { css } from 'lit'

export const imageSequenceStyles = css`
  :host {
    position: relative;
    display: flex;
    justify-content: center;
    max-height: 100vh;
    max-width: 100vw;
  }

  .image-sequence {
    height: 100vh;
    width: 100%;
  }

  .image-sequence.interactive {
    cursor: grab;
  }

  .image-sequence.interactive.loading {
    cursor: wait;
  }

  .overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(0,0,0,0);
    color: white;
    transition: all 0.25s linear;
    z-index: 9999;
    pointer-events: none;
  }

  .overlay.visible {
    opacity: 1;
    pointer-events: auto;
  }

  .overlay:not(.visible) {
    opacity: 0;
    display: none;
  }

  .overlay:hover {
    background: rgba(0,0,0,0.6);
  }

  .overlay.loading.visible {
    animation: loading-overlay 1s infinite alternate;
  }

  .buffering-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-radius: 5px;
    height: 15%;
    width: 15%;
    background: rgba(0,0,0,0.6);
  }

  @keyframes loading-overlay {
    from {
      opacity: 0.6;
    }
    to {
      opacity: 1;
    }
  }

  .description {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    opacity: 0;
    transition: opacity 0.25s linear;
  }

  .description__icon {
    fill: white;
    height: 2em;
  }

  .overlay:hover .description {
    opacity: 1;
  }

  canvas {
    display: none;
    pointer-events: none;
    user-select: none;
    object-fit: contain;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  canvas.visible {
    display: block;
  }

  canvas.fade-in {
    animation: fade-in 0.25s 1 linear;          
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  slot[name='placeholder-image'] img {
    display: block;
    pointer-events: none;
    opacity: 0;
    height: 100%;
    width: 100%;
    margin: 0px auto 0px;
    transition: opacity 0.25s linear;
    object-fit: contain;
  }

  slot[name='placeholder-image'] img.loading {
    opacity: 1;
    filter: brightness(0.4);
    animation: loading-image 1s linear infinite alternate;
  }

  @keyframes loading-image {
    from {
      filter: brightness(0.4);
    }
    to {
      filter: brightness(0.2);
    }
  }`