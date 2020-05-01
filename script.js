import dataObject from './js/dataObject.js';


const data = dataObject.dataObject;


const isEnglish = localStorage.getItem('isEng') || 'true';
let isCapslock = false;

if (localStorage.getItem('isEng') === null) {
  localStorage.setItem('isEng', isEnglish);
}

const capslockHandler = (elem) => {
  const caps = elem.querySelector('.caps');

  caps.addEventListener('click', () => {
    if (!isCapslock) {
      elem.innerHTML = '';
      drawKeys(data.upperCaseEn, elem);
      elem.querySelector('.caps').classList.add('active');
      isCapslock = true;
    } else {
      elem.innerHTML = '';
      drawKeys(data.lowerCaseEn, elem);
      isCapslock = false;
    }
  });
};
const keyStyleHandler = (elem) => {
  elem.addEventListener('mousedown', (event) => {
    const { target } = event;
    if (target.tagName === 'SPAN' || target.tagName === 'SECTION' || target.innerText === 'Shift' || target.innerText === 'CapsLock') return;
    target.classList.add('active');
  });
  elem.addEventListener('mouseup', (event) => {
    if (event.target.className === 'keyboard-styles' || event.target.innerText === 'Shift' || event.target.innerText === 'CapsLock') return;
    event.target.classList.remove('active');
  });
};

const drawKeys = (arr, elem) => {
  for (let i = 0; i < arr.length; i += 1) {
    const newKey = document.createElement('div');
    newKey.id = data.codes[i];

    switch (arr[i]) {
      case ('&#8592;'): newKey.classList.add('backspace');
        break;
      case ('CapsLock'): newKey.classList.add('caps');
        break;
      case ('Shift'):
        newKey.classList.add('shift');
        break;
      case ('Tab'):
        newKey.classList.add('tab');
        break;
      case ('Enter'):
        newKey.classList.add('enter');
        break;
      case ('Ctrl'):
        newKey.classList.add('ctrl');
        break;
      case ('Alt'):
        newKey.classList.add('alt');
        break;
      case ('&emsp;'):
        newKey.classList.add('space');
        break;
      default:
        newKey.classList.add('key-style');
    }

    newKey.innerHTML = arr[i];
    elem.append(newKey);
  }

  capslockHandler(elem);
  shiftHandler(elem);
  keyStyleHandler(elem);
};

const drawKeyboard = () => {
  const container = document.createElement('div');
  const keyboard = document.createElement('section');
  const textarea = document.createElement('textarea');
  const info = document.createElement('p');
  textarea.rows = 5;
  textarea.cols = 80;
  info.innerText = 'Press Ctrl+Alt to switch ru/en';
  info.classList.add('info');

  document.body.append(container);
  container.classList.add('main-styles');
  container.append(textarea, keyboard, info);
  keyboard.classList.add('keyboard-styles');

  if (localStorage.getItem('isEng') === 'true') {
    drawKeys(data.lowerCaseEn, keyboard);
    textarea.focus();
    printOnClick(keyboard, textarea);
  }

  if (localStorage.getItem('isEng') === 'false') {
    drawKeys(data.lowerCaseRu, keyboard);
    textarea.focus();
    printOnClick(keyboard, textarea);
  }
};

const printOnClick = (keyboard, textfield) => {
  keyboard.addEventListener('click', (event) => {
    if (event.target.className === 'keyboard-styles') return;

    const letter = event.target.innerText;
    const position = textfield.selectionStart;

    switch (event.target.innerText) {
      case '←':
        textfield.value = textfield.value.slice(0, -1);
        break;
      case 'Enter': textfield.value += '\n';
        break;
      case 'Tab': textfield.value += '\t';
        break;
      case '◄':
        textfield.focus();
        textfield.selectionStart = position - 1;
        textfield.selectionEnd = position - 1;
        break;
      case '►':
        textfield.focus();
        textfield.selectionStart = position + 1;
        textfield.selectionEnd = position + 1;
        break;
      case 'CapsLock':
      case 'Ctrl':
      case 'Alt':
      case 'Win':
      case 'Shift': break;
      default: clickSelectionHandler(textfield, letter);
    }
  });
};

const clickSelectionHandler = (textfield, str) => {
  const text = textfield.value;
  const caretPos = textfield.selectionStart;
  const caretPosEnd = textfield.selectionEnd;

  textfield.value = text.substr(0, caretPos) + str + text.substr(caretPosEnd);
  textfield.selectionStart = caretPos + str.length;
  textfield.selectionEnd = caretPos + str.length;
  textfield.focus();
};

const shiftHandler = (elem) => {
  const shift = document.querySelectorAll('.shift');

  shift.forEach((item) => {
    item.addEventListener('mousedown', () => {
      elem.innerHTML = '';
      if (!isCapslock) drawKeys(data.upperCaseEn, elem);
      else drawKeys(data.lowerCaseEn, elem);
      elem.querySelectorAll('.shift')[0].classList.add('active');
      elem.querySelectorAll('.shift')[1].classList.add('active');
    });
    item.addEventListener('mouseup', () => {
      elem.innerHTML = '';
      if (!isCapslock) drawKeys(data.lowerCaseEn, elem);
      else drawKeys(data.upperCaseEn, elem);
    });
  });
};

const printOnKeypress = () => {
  document.addEventListener('keydown', (event) => {
    event.preventDefault();
    if (event.code === 'CapsLock') {
      event.preventDefault();
      if (isCapslock) {
        document.querySelector('.keyboard-styles').innerHTML = '';
        drawKeys(data.lowerCaseEn, document.querySelector('.keyboard-styles'));
        document.getElementById(event.code).classList.add('active');
        isCapslock = false;
      } else {
        document.querySelector('.keyboard-styles').innerHTML = '';
        drawKeys(data.upperCaseEn, document.querySelector('.keyboard-styles'));
        document.querySelectorAll('DIV').forEach((item) => {
          item.classList.remove('active');
        });
        isCapslock = true;
      }
    }

    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      event.preventDefault();
      if (document.querySelector('.caps').classList.contains('active')) {
        document.querySelector('.keyboard-styles').innerHTML = '';
        drawKeys(data.lowerCaseEn, document.querySelector('.keyboard-styles'));
        document.querySelector('.caps').classList.add('active');
      } else {
        document.querySelector('.keyboard-styles').innerHTML = '';
        drawKeys(data.upperCaseEn, document.querySelector('.keyboard-styles'));
      }
    }

    if (event.code === 'AltLeft' || event.code === 'AltRight' || event.code === 'Tab') {
      event.preventDefault();
    }

    switch (document.getElementById(event.code).innerText) {
      case 'CapsLock':
      case 'Shift':
      case 'Ctrl':
      case 'Alt':
      case 'Win':
        document.querySelector('TEXTAREA').value += '';
        break;
      case 'Enter':
        document.querySelector('TEXTAREA').value += '\n';
        break;
      case 'Tab':
        document.querySelector('TEXTAREA').value += '\t';
        break;
      case '←':
        document.querySelector('TEXTAREA').value = document.querySelector('TEXTAREA').value.slice(0, -1);
        break;
      case '◄':
        event.preventDefault();
        document.querySelector('TEXTAREA').focus();
        document.querySelector('TEXTAREA').selectionStart = document.querySelector('TEXTAREA').selectionStart - 1;
        document.querySelector('TEXTAREA').selectionEnd = document.querySelector('TEXTAREA').selectionEnd - 1;
        break;
      case '►':
        event.preventDefault();
        document.querySelector('TEXTAREA').focus();
        document.querySelector('TEXTAREA').selectionStart = document.querySelector('TEXTAREA').selectionStart + 1;
        document.querySelector('TEXTAREA').selectionEnd = document.querySelector('TEXTAREA').selectionEnd + 1;
        break;
      default:
        clickSelectionHandler(document.querySelector('TEXTAREA'), document.getElementById(event.code).innerText);
    }

    document.getElementById(event.code).classList.add('active');
    document.querySelector('TEXTAREA').focus();
  });

  document.addEventListener('keyup', (event) => {
    document.querySelectorAll('DIV').forEach((item) => {
      item.classList.remove('active');
      if (item.classList.contains('caps') && isCapslock) item.classList.add('active');
    });

    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      if (document.querySelector('.caps').classList.contains('active')) {
        document.querySelector('.keyboard-styles').innerHTML = '';
        drawKeys(data.upperCaseEn, document.querySelector('.keyboard-styles'));
        document.querySelector('.caps').classList.add('active');
      } else {
        document.querySelector('.keyboard-styles').innerHTML = '';
        drawKeys(data.lowerCaseEn, document.querySelector('.keyboard-styles'));
      }
    }
    document.querySelector('TEXTAREA').focus();
  });
};

const switchLanguage = () => {
  document.addEventListener('keydown', (event) => {
    if (!event.ctrlKey || !event.altKey) return;
    event.preventDefault();

    if (localStorage.getItem('isEng') === 'true' && document.querySelector('.caps').classList.contains('active')) {
      localStorage.setItem('isEng', 'false');
      document.querySelector('.keyboard-styles').innerHTML = '';
      drawKeys(data.upperCaseRu, document.querySelector('.keyboard-styles'));
    } else if (localStorage.getItem('isEng') === 'false' && document.querySelector('.caps').classList.contains('active')) {
      localStorage.setItem('isEng', 'true');
      document.querySelector('.keyboard-styles').innerHTML = '';
      drawKeys(data.upperCaseEn, document.querySelector('.keyboard-styles'));
    } else if (localStorage.getItem('isEng') === 'true' && !document.querySelector('.caps').classList.contains('active')) {
      localStorage.setItem('isEng', 'false');
      document.querySelector('.keyboard-styles').innerHTML = '';
      drawKeys(data.lowerCaseRu, document.querySelector('.keyboard-styles'));
    } else if (localStorage.getItem('isEng') === 'false' && !document.querySelector('.caps').classList.contains('active')) {
      localStorage.setItem('isEng', 'true');
      document.querySelector('.keyboard-styles').innerHTML = '';
      drawKeys(data.lowerCaseEn, document.querySelector('.keyboard-styles'));
    } else {
      localStorage.setItem('isEng', 'true');
    }
  });
};

window.onload = function () {
  drawKeyboard();
  printOnKeypress();
  switchLanguage();
};
