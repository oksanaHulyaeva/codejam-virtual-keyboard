import dataObject from './js/dataObject.js';

let isCapslock = false;
const data = dataObject.dataObject;


let isEnglish = localStorage.getItem('isEnglish') || true;


if (localStorage.getItem('isEnglish') === null) {
  localStorage.setItem('isEnglish', isEnglish);
}


const classAdd = (elem, userClass) => {
  elem.classList.add(userClass);
};

const classRemove = (elem, userClass) => {
  elem.classList.remove(userClass);
};

const drawKeys = (arr, elem) => {
  const board = elem;
  board.innerHTML = '';
  for (let i = 0; i < arr.length; i += 1) {
    const newKey = document.createElement('div');
    newKey.id = data.codes[i];

    switch (arr[i]) {
      case '&#8592;': newKey.classList.add('backspace');
        break;
      case 'CapsLock': newKey.classList.add('caps');
        break;
      case 'Shift':
        newKey.classList.add('shift');
        break;
      case 'Tab':
        newKey.classList.add('tab');
        break;
      case 'Enter':
        newKey.classList.add('enter');
        break;
      case 'Ctrl':
        newKey.classList.add('ctrl');
        break;
      case 'Alt':
        newKey.classList.add('alt');
        break;
      case '&emsp;':
        newKey.classList.add('space');
        break;
      default:
        newKey.classList.add('key-style');
    }

    newKey.innerHTML = arr[i];
    board.append(newKey);
  }
};

const capslockHandler = (elem) => {
  const board = elem;
  const caps = elem.querySelector('.caps');

  caps.addEventListener('click', () => {
    board.innerHTML = '';
    if (!isCapslock) {
      checkRegister(board);
      classAdd(board.querySelector('.caps'), 'active');
    } else {
      board.innerHTML = '';
      checkRegister(board);
    }
  });
};

const shiftHandler = (elem) => {
  const board = elem;
  const shifts = document.querySelectorAll('.shift');

  shifts.forEach((item) => {
    item.addEventListener('mousedown', () => {
      board.innerHTML = '';
      checkRegister(board);
      classAdd(document.querySelectorAll('.shift')[0], 'active');
      classAdd(document.querySelectorAll('.shift')[1], 'active');
    });

    item.addEventListener('mouseup', () => {
      board.innerHTML = '';
      checkRegister(board);
    });
  });
};

const keyStyleHandler = (elem) => {
  elem.addEventListener('mousedown', (event) => {
    const { target } = event;
    if (target.tagName === 'SPAN' || target.tagName === 'SECTION' || target.innerText === 'Shift' || target.innerText === 'CapsLock') return;
    classAdd(target, 'active');
    target.classList.add('active');
  });
  elem.addEventListener('mouseup', (event) => {
    if (event.target.className === 'keyboard-styles' || event.target.innerText === 'Shift' || event.target.innerText === 'CapsLock') return;
    classRemove(event.target, 'active');
  });
};

const mainKeyHandler = (arr, elem) => {
  drawKeys(arr, elem);
  capslockHandler(elem);
  shiftHandler(elem);
  keyStyleHandler(elem);
};

const checkRegister = (elem) => {
  if (!isCapslock) {
    if (!isEnglish) mainKeyHandler(data.upperCaseRu, elem);
    else {
      mainKeyHandler(data.upperCaseEn, elem);
    }
    classAdd(elem.querySelector('.caps'), 'active');
    isCapslock = true;
  } else {
    if (!isEnglish) mainKeyHandler(data.lowerCaseRu, elem);
    else {
      mainKeyHandler(data.lowerCaseEn, elem);
    }
    isCapslock = false;
  }
};

const clickSelectionHandler = (textfield, str) => {
  const field = textfield;
  const text = field.value;
  const caretPos = field.selectionStart;
  const caretPosEnd = field.selectionEnd;

  field.value = text.substr(0, caretPos) + str + text.substr(caretPosEnd);
  field.selectionStart = caretPos + str.length;
  field.selectionEnd = caretPos + str.length;
  field.focus();
};

const printOnClick = (keyboard, textfield) => {
  const field = textfield;
  keyboard.addEventListener('click', (event) => {
    if (event.target.className === 'keyboard-styles') return;

    const letter = event.target.innerText;
    const position = field.selectionStart;

    switch (event.target.innerText) {
      case '←':
        field.value = field.value.slice(0, -1);
        break;
      case 'Enter': field.value += '\n';
        break;
      case 'Tab': field.value += '\t';
        break;
      case '◄':
        field.focus();
        field.selectionStart = position - 1;
        field.selectionEnd = position - 1;
        break;
      case '►':
        field.focus();
        field.selectionStart = position + 1;
        field.selectionEnd = position + 1;
        break;
      case 'CapsLock':
      case 'Ctrl':
      case 'Alt':
      case 'Win':
      case 'Shift': break;
      default: clickSelectionHandler(field, letter);
    }
  });
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

  if (isEnglish) {
    mainKeyHandler(data.lowerCaseEn, keyboard);
    textarea.focus();
    printOnClick(keyboard, textarea);
  }

  if (!isEnglish) {
    mainKeyHandler(data.lowerCaseRu, keyboard);
    textarea.focus();
    printOnClick(keyboard, textarea);
  }
};

const printOnKeypress = () => {
  document.addEventListener('keydown', (event) => {
    event.preventDefault();

    const eCode = event.code;
    const targetKey = document.getElementById(eCode);

    if (eCode === 'CapsLock') {
      event.preventDefault();
      if (isCapslock) {
        document.querySelector('.keyboard-styles').innerHTML = '';
        checkRegister(document.querySelector('.keyboard-styles'));
        classAdd(targetKey, 'active');
        isCapslock = false;
      } else {
        document.querySelector('.keyboard-styles').innerHTML = '';
        checkRegister(document.querySelector('.keyboard-styles'));
        document.querySelectorAll('DIV').forEach((item) => {
          classRemove(item, 'active');
        });
        isCapslock = true;
      }
    }

    if (eCode === 'ShiftLeft' || eCode === 'ShiftRight') {
      event.preventDefault();

      if (isCapslock) {
        document.querySelector('.keyboard-styles').innerHTML = '';
        checkRegister(document.querySelector('.keyboard-styles'));
      } else {
        document.querySelector('.keyboard-styles').innerHTML = '';
        checkRegister(document.querySelector('.keyboard-styles'));
      }
      document.querySelectorAll('.shift').forEach((item) => {
        classAdd(item, 'active');
      });
    }

    if (eCode === 'AltLeft' || eCode === 'AltRight' || eCode === 'Tab') {
      event.preventDefault();
    }

    const field = document.querySelector('TEXTAREA');
    switch (targetKey.innerText) {
      case 'CapsLock':
      case 'Shift':
      case 'Ctrl':
      case 'Alt':
      case 'Win':
        field.value += '';
        break;
      case 'Enter':
        field.value += '\n';
        break;
      case 'Tab':
        field.value += '\t';
        break;
      case '←':
        field.value = field.value.slice(0, -1);
        break;
      case '◄':
        event.preventDefault();
        field.focus();
        field.selectionStart -= 1;
        field.selectionEnd -= 1;
        break;
      case '►':
        event.preventDefault();
        field.focus();
        field.selectionStart += 1;
        field.selectionEnd += 1;
        break;
      default:
        clickSelectionHandler(field, targetKey.innerText);
    }
    classAdd(targetKey, 'active');
    field.focus();
  });

  document.addEventListener('keyup', (event) => {
    document.querySelectorAll('DIV').forEach((item) => {
      classRemove(item, 'active');
      if (item.classList.contains('caps') && isCapslock) item.classList.add('active');
    });

    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      if (isCapslock) {
        document.querySelector('.keyboard-styles').innerHTML = '';
        checkRegister(document.querySelector('.keyboard-styles'));
      } else {
        document.querySelector('.keyboard-styles').innerHTML = '';
        checkRegister(document.querySelector('.keyboard-styles'));
      }
    }
    document.querySelector('TEXTAREA').focus();
  });
};

const switchLanguage = () => {
  document.addEventListener('keydown', (event) => {
    if (!event.ctrlKey || !event.altKey) return;
    event.preventDefault();
    const keyboard = document.querySelector('.keyboard-styles');

    if (isEnglish && isCapslock) {
      isEnglish = false;
      localStorage.setItem('isEnglish', isEnglish);
      keyboard.innerHTML = '';
      mainKeyHandler(data.upperCaseRu, keyboard);
    } else if (!isEnglish && isCapslock) {
      isEnglish = true;
      localStorage.setItem('isEnglish', isEnglish);
      keyboard.innerHTML = '';
      mainKeyHandler(data.upperCaseEn, keyboard);
    } else if (isEnglish && !isCapslock) {
      isEnglish = false;
      localStorage.setItem('isEnglish', isEnglish);
      keyboard.innerHTML = '';
      mainKeyHandler(data.lowerCaseRu, keyboard);
    } else if (!isEnglish && !isCapslock) {
      isEnglish = true;
      localStorage.setItem('isEnglish', isEnglish);
      keyboard.innerHTML = '';
      mainKeyHandler(data.lowerCaseEn, keyboard);
    } else {
      isEnglish = true;
      localStorage.setItem('isEnglish', isEnglish);
    }
  });
};

const keyboardHandler = () => {
  drawKeyboard();
  printOnKeypress();
  switchLanguage();
};

window.onload = keyboardHandler();
