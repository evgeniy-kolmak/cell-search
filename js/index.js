const table = document.querySelector('table');
const row = document.querySelectorAll('tr');
const columnInRow = Array.from(row).map(el => Array.from(el.children));
const column = document.querySelectorAll('td');
const start = document.querySelector('.start');
const reset = document.querySelectorAll('.reset');
const modal = document.querySelector('.modal')
const content = document.querySelector('.content');
const addTime = document.querySelector('.add-time');
const record = document.querySelector('.record');
const timer = document.querySelector('.timer');
const info = document.querySelector('.img-info');
const rules = document.querySelector('.rules');
let values;
let doneValues;
let logs;
let timerId;
let countBonusValues;
let countTimer = 60000;
const interval = 1000;
const bonus = ['star', 'bomb', 'luck', 'skull'];
let star;
let bomb;
let luck;
let skull;
let bonusValues = [];
let statusGame;


// Добовление ID к ячейкам таблицы
const addIdElements = () => {
  Array.from(row).map((element, index) => element.id = index)
  columnInRow.map((items, i) => {
    items.map((item, index) => item.id = `${i}${index}`)
  })
}

addIdElements();

// Выбор рандомно 10 ячеек
const randomCell = count => {
  const result = [];
  for (let i = 0; i < count; i++) {
    const value = Math.round(Math.random() * 100).toString();
    if (!result.includes(value)) {
      if (value.length > 2) {
        i--;
        continue;
      } else if (value.length < 2) {
        result.push(`0${value}`)
      } else {
        result.push(value)
      }
    } else {
      i--;
      continue;
    }
  }

  return result
}

// Финиш
const isFinish = value => {
  if (!doneValues.includes(value)) {
    doneValues.push(value)
    if (doneValues.length === 10) {
      let count = countTimer / interval;
      clearInterval(timerId)
      modal.style.display = 'block'
      timer.textContent = 'Вы победили!'
      isRecord(count);
      content.textContent = `Ваше время ${count} секунд(ы)`;
      document.querySelector('.cup').style.display = 'block';
    }
  }
}

// Правила

function showRules() {
  rules.classList.toggle('visible')
};

// Рекорд
const isRecord = count => {
  if (count > localStorage.timeCount) {
    localStorage.timeCount = count;
  }

  record.textContent = `Ваш рекорд ${localStorage.timeCount} секунд(ы)`;

}

const showRecord = () => {
  if (localStorage.timeCount === undefined) {
    localStorage.timeCount = 0;
  }
  record.textContent = `Ваш рекорд ${localStorage.timeCount} секунд(ы)`;
}

showRecord();

// Количество бонусов
const countBonus = value => {
  if (value === 'star') {
    return Math.round(Math.random() * 5);
  } else if (value === 'bomb') {
    return Math.round(Math.random() * 4);
  } else if (value === 'skull') {
    return Math.round(Math.random());
  } else {
    return 1;
  }
}

// Добовление бонусов
const addBonus = coll => {
  const collectionCount = coll.map(item => (countBonus(item)));
  const sumCountBonus = collectionCount.reduce((acc, item) => acc += item, 0)
  for (let i = 0; i < sumCountBonus; i++) {
    const value = Math.round(Math.random() * 100).toString();
    if (values.includes(value) || bonusValues.includes(value)) {
      i--;
      continue;
    } else if (!values.includes(value)) {
      if (value.length > 2) {
        i--;
        continue;
      } else if (value.length < 2) {
        bonusValues.push(`0${value}`)
      } else {
        bonusValues.push(value)
      }
    }
  }
  return collectionCount;

}

// Добовление бонусов на поле
const addSuperBonus = () => {
  let count;

  if (countBonusValues[countBonusValues.length - 1] === 0) {
    luck = bonusValues.slice(-1);
    count = 1;

  } else {
    luck = [bonusValues[bonusValues.length - 2]];
    skull = bonusValues.slice(-1);
    count = 2;

    skull.forEach(el => {
      const element = document.getElementById(`${el}`);
      const img = document.createElement('img');
      img.style.verticalAlign = 'bottom'
      img.style.opacity = 0;
      img.style.width = '32px';
      img.style.height = '32px';
      img.src = './img/skull.png';
      element.append(img)

    })

  }

  for (let i = countBonusValues[0]; i < bonusValues.length - count; i++) {
    bomb.push(bonusValues[i])
  }

  for (let i = 0; i < countBonusValues[0]; i++) {
    star.push(bonusValues[i])
  }


  star.forEach(el => {
    const element = document.getElementById(`${el}`);
    const img = document.createElement('img');
    img.style.verticalAlign = 'bottom';
    img.style.opacity = 0;
    img.style.width = '32px';
    img.style.height = '32px';
    img.src = './img/star.png';
    element.append(img)
  })

  bomb.forEach(el => {
    const element = document.getElementById(`${el}`);
    const img = document.createElement('img');
    img.style.verticalAlign = 'bottom';
    img.style.opacity = 0;
    img.style.width = '32px';
    img.style.height = '32px';
    img.src = './img/bomb.png';
    element.append(img);
  })

  luck.forEach(el => {
    const element = document.getElementById(`${el}`);
    const img = document.createElement('img');
    img.style.verticalAlign = 'bottom'
    img.style.opacity = 0;
    img.style.width = '32px';
    img.style.height = '32px';
    img.src = './img/luck.png';
    element.append(img)

  })
}

const tableListener = e => {
  if (values.includes(e.target.id)) {
    e.target.style.backgroundColor = '#66CC66';
    if (!doneValues.includes(e.target.id)) {
      addTime.style.opacity = 1;
      addTime.style.color = '#66CC66';
      addTime.textContent = '+ 10 секунд'
      setTimeout(() => {
        addTime.style.opacity = 0;
      }, 1000)
      countTimer += 10000;
      isFinish(e.target.id)
    }
  } else {
    if (e.target.nodeName === 'TD') {
      e.target.style.backgroundColor = '#FF6666';
      if (!logs.includes(e.target.id)) {
        addTime.style.opacity = 1;
        addTime.style.color = '#FF6666';
        addTime.textContent = '- 1 секунда'
        setTimeout(() => {
          addTime.style.opacity = 0;
        }, 500)
        countTimer -= 1000
        logs.push(e.target.id)
      }
    } else if (e.target.nodeName === 'IMG') {
      if (star.includes(e.target.parentNode.id)) {
        e.target.style.opacity = 1;
        e.target.parentNode.style.backgroundColor = '#7c2222';
        if (!logs.includes(e.target.parentNode.id)) {
          addTime.style.opacity = 1;
          addTime.style.color = '#7c2222';
          addTime.textContent = 'Звезда! +5 секунд'
          setTimeout(() => {
            addTime.style.opacity = 0;
          }, 1000)
          countTimer += 5000
          logs.push(e.target.parentNode.id)
        }
      } else if (bomb.includes(e.target.parentNode.id)) {
        e.target.style.opacity = 1;
        e.target.parentNode.style.backgroundColor = 'orange';
        if (!logs.includes(e.target.parentNode.id)) {
          addTime.style.opacity = 1;
          addTime.style.color = '#7c2222';
          addTime.textContent = 'Упс! -8 секунд'
          setTimeout(() => {
            addTime.style.opacity = 0;
          }, 1000)
          countTimer -= 8000;
          logs.push(e.target.parentNode.id);
        }
      } else if (luck.includes(e.target.parentNode.id)) {
        e.target.style.opacity = 1;
        e.target.parentNode.style.backgroundColor = 'purple';
        if (!logs.includes(e.target.parentNode.id)) {
          addTime.style.opacity = 1;
          addTime.style.color = 'purple';
          addTime.textContent = 'Ого, это большая удача!'
          setTimeout(() => {
            addTime.style.opacity = 0;
          }, 2000)
          logs.push(e.target.parentNode.id);
          values.forEach(item => {
            if (!doneValues.includes(item)) {
              const cell = document.getElementById(`${item}`);
              cell.style.transitionDuration = '.8s';
              cell.style.backgroundColor = 'grey';
              setTimeout(() => {
                if (!doneValues.includes(item)) {
                  cell.style.backgroundColor = null;
                }
              }, 3000)
            }
          })
        }
      } else {
        e.target.style.opacity = 1;
        e.target.parentNode.style.backgroundColor = 'black';
        if (!logs.includes(e.target.parentNode.id)) {
          addTime.style.opacity = 1;
          addTime.style.color = 'black';
          addTime.textContent = 'Сделка с дьяволом!'
          setTimeout(() => {
            addTime.style.opacity = 0;
            countTimer += 30000;
          }, 2000)
          logs.push(e.target.parentNode.id);
          column.forEach(cell => {
            if (cell.id !== e.target.parentNode.id) {
              cell.style.transitionDuration = '.8s';
              cell.style.backgroundColor = null;
              if (cell.firstChild) {
                cell.firstChild.style.opacity = 0;
                cell.firstChild.style.transitionDuration = '.8s';
              }
            }
          })
        }
      }
    }
  }
}

// Начало игры
const startGame = statusGame => {
  if (statusGame) {
    table.addEventListener('click', tableListener);
  } else {
    table.removeEventListener('click', tableListener);
    info.addEventListener('click', showRules);
  }
}


start.addEventListener('click', function (e) {
  if (rules.classList.contains('visible')) {
    rules.classList.remove('visible');
  }

  info.removeEventListener('click', showRules);
  statusGame = true;
  reset[0].disabled = false;
  start.disabled = true;
  startGame(statusGame);
  e.preventDefault();

  table.style.backgroundColor = '#fff'
  table.style.transitionDuration = '1s'

  values = randomCell(10);

  doneValues = [];
  logs = [];

  countBonusValues = addBonus(bonus);


  timerId = setInterval(() => {
    countTimer -= interval;
    timer.textContent = `${countTimer / interval
      } секунд`;
    if (countTimer < interval) {
      modal.style.display = 'block'
      content.textContent = `Увы, время вышло!`;
      document.querySelector('.time').style.display = 'block';
      clearInterval(timerId)
    }
  }, interval);

  star = [];
  bomb = [];

  addSuperBonus();

  document.querySelectorAll('.content-promo').forEach(item => item.style.display = 'none')
})



reset.forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    clearInterval(timerId)
    table.style.backgroundColor = '#000';
    column.forEach(el => {
      el.style.backgroundColor = null;
      el.style.transitionDuration = '.5s';
      el.addEventListener('click', function () {
        el.style.backgroundColor = null;
      })
      el.innerHTML = '';
      bonusValues = [];
      star = [];
      bomb = [];
      luck = null;
      skull = null;

    })
    start.disabled = false;


    clearInterval(timerId)
    countTimer = 60000;
    modal.style.display = 'none';
    timer.textContent = 'Найдите все 10 плиток'
    statusGame = false;
    startGame(statusGame);

  })
})









