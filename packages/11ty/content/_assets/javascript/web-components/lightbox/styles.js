import { css } from 'lit';

export const styles = css`
.q-lightbox {
  --atlas-z-index: 0;
  font-family: "IBM Plex Sans Condensed",sans-serif;
  color: white;
}

.q-lightbox,
.q-lightbox__slide,
.q-lightbox__image {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.q-lightbox__slide {
  transform: translateY(-100%);
  opacity: 0;
  transition: transform 0s 0.4s, opacity 0.4s linear;
}

.current.q-lightbox__slide {
  transform: translateY(0);
  opacity: 1;
  transition: transform 0s, opacity 0.4s linear;
}

.q-lightbox__image img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.q-lightbox__fullscreen-button {
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
  margin-top: 10px;
  margin-left: 10px;
  padding: 0;
  border: 0;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.5);
  background-repeat: no-repeat;
  background-position-x: 2px;
  background-position-y: 2px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAA0AgMAAADpgsAbAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAACVBMVEUAAAD///////9zeKVjAAAAAnRSTlMAgJsrThgAAAAySURBVBjTY2AgFmitYFrVgERrMDAw4aMJAUL60e2jNiDaP2wrIf7hWgXRiIOGqaOufwA6TR6/lErWHQAAAABJRU5ErkJggg==);
}

.q-lightbox__fullscreen-button--active.q-lightbox__fullscreen-button {
  background-position-x: 2px;
  background-position-y: -24px;
}

.q-lightbox__navigation-button {
  position: absolute;
  top: 50%;
  width: 40px;
  height: 35%;
  padding: 0;
  border: 0;
  transform: translateY(-50%);
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0);
}

.q-lightbox__navigation-button::before {
  content: '';
  display: block;
  position: absolute;
}

.q-lightbox__navigation-button--next {
  right: 0;
}

.q-lightbox__navigation-button--previous {
  left: 0;
}

.q-lightbox__navigation-button--next::before,
.q-lightbox__navigation-button--previous::before {
  content: '';
  display: block
  position: absolute;
  top: 50%;
  width: 30px;
  height: 30px;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  background-repeat: no-repeat;
  /* TODO replace base64 encoded background image arrow icons stolen from magnific-popup library with in-repo assets */
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQgAAABYCAQAAACjBqE3AAAB6klEQVR4Ae3bsWpUQRTG8YkkanwCa7GzVotsI/gEgk9h4Vu4ySLYmMYgbJrc3lrwZbJwC0FMt4j7F6Y4oIZrsXtgxvx/1c0ufEX4cnbmLCmSJEmSJEmSJEmSJP3XCBPvbJU+8doWmDFwyZpLBmYlNJebz0KwzykwsuSYJSNwykEJreV2BaBMaLIQZ2xYcFgqDlmw4ayE/FwL0dDk4Qh4W37DAjgqIT+3HRbigjH+iikVdxgZStgyN0Su2sXIeTwTT+esdpcbIlfNAuZ/TxresG4zV8kYWSZNiKUTokMMSWeIwTNEn4fK2TW3gRNgVkJLuVksROA9G+bEvoATNlBCa7nZXEwdxEZxzpKRKFh+bsv8LmPFmhX1OwfIz81jIRJQ5eeqG9B+riRJkiRJkiRJkiRJkiRJkiRJUkvA/8RQoEpKlJWINFkJ62AlrEP/mNBibnv2yz/A3t7Uq3LcpoxP8COjC1T5vxoAD5VdoEqdDrd5QuW1swtUSaueh3zkiuBiqgtA2OlkeMcP/uDqugsJdbjHF65VdPMKwS0+WQc/MgKvrIOHysB9vgPwk8+85hmPbnQdvHZyDMAFD7L3EOpgMcVdvnHFS0/vlatrXvCVx0U9gt3fxvnA0/hB4nmRJEmSJEmSJEmSJGmHfgFLaDPoMu5xWwAAAABJRU5ErkJggg==);
}

.q-lightbox__navigation-button--next::before {
  margin-right: 10px;
  background-position-x: -95px;
  background-position-y: -44px;
}

.q-lightbox__navigation-button--previous::before {
  margin-left: 10px;
  background-position-x: -139px;
  background-position-y: -44px;
}

.q-lightbox__download-and-counter {
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 10px;
  margin-right: 10px;
  padding: 0 8px;
  background: rgba(0,0,0,0.5);
  font-size: 1rem;
  font-weight: bold;
  line-height: 30px;
}

.q-lightbox__download-and-counter--modal.q-lightbox__download-and-counter {
  margin-right: 40px;
}

.q-lightbox__caption {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 25px;
  padding: 0 8px;
  background: rgba(0,0,0,0.5);
  font-size: 0.875rem;
  line-height: 30px;
}

.q-lightbox__caption-label {
  margin-right: 0.5rem;
  font-weight: bold;
}
`;
