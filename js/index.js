const table = document.querySelector('table');
const row = document.querySelectorAll('tr');
const columnInRow = Array.from(row).map(el => Array.from(el.children));
const column = document.querySelectorAll('td');
const start = document.querySelector('.start');
const reset = document.querySelectorAll('.reset');
const timer = document.querySelector('.timer');
const content = document.querySelector('.content');
const addTime = document.querySelector('.add-time');
const record = document.querySelector('.record');
const modal = document.querySelector('.modal');
let countTimer = 60000;
let timerId;
const bonus = ['star', 'bomb', 'luck'];

const addIdElements = () => {
  Array.from(row).map((element, index) => element.id = index)
  columnInRow.map((items, i) => {
    items.map((item, index) => item.id = `${i}${index}`)
  })
}

addIdElements();

const showRecord = () => {
  if (localStorage.timeCount === undefined) {
    localStorage.timeCount = 0;
  }
  record.textContent = `Ваш рекорд ${localStorage.timeCount} секунд(ы)`;
}

showRecord();

start.addEventListener('click', function (e) {
  e.preventDefault();
  table.style.backgroundColor = "#fff"
  table.style.transitionDuration = '1s'

  const randomCell = count => {
    const result = [];
    for (let i = 0; i < count; i++) {
      const value = Math.round(Math.random() * 100).toString();
      if (value.length > 2) {
        result.push('00')
      } else if (value.length < 2) {
        result.push(`0${value}`)
      } else if (result.includes(value)) {
        i--
        continue;
      } else {
        result.push(value)
      }
    }

    return result
  }


  const countCell = 10;
  const values = randomCell(countCell);
  // console.log(values);

  const data = [];

  const isFinish = data => {
    let count = 0;
    if (data.length === countCell) {
      count = countTimer / interval;
      clearInterval(timerId)
      modal.style.display = 'block'
      timer.textContent = 'Вы победили!'
      isRecord(count);
      content.textContent = `Ваше время ${count} секунд(ы)`;
      document.querySelector('.cup').style.display = 'block';

    }
  }

  const bonusValues = [];

  const addBonus = (coll) => {
    const collectionCount = coll.map(item => (countBonus(item)));
    const sumCountBonus = collectionCount.reduce((acc, item) => acc += item, 0)
    for (let i = 0; i < sumCountBonus; i++) {
      const value = Math.round(Math.random() * 100).toString();
      if (values.includes(value) || bonusValues.includes(value)) {
        i--;
        continue;
      } else if (!values.includes(value)) {
        if (value.length > 2) {
          bonusValues.push('00')
        } else if (value.length < 2) {
          bonusValues.push(`0${value}`)
        } else {
          bonusValues.push(value)
        }
      }
    }
    return collectionCount;

  }

  const countBonusValues = addBonus(bonus);
  console.log(bonusValues);
  console.log(countBonusValues);


  const star = [];

  for (let i = 0; i < countBonusValues[0]; i++) {
    star.push(bonusValues[i])
  }

  const bomb = [];

  for (let i = countBonusValues[0]; i < bonusValues.length - 1; i++) {
    bomb.push(bonusValues[i])
  }

  const luck = bonusValues.slice(-1)





  // вставлять элементы сразу в html при кнопке старт, а не при нажатии и рикпываит классом

  // Дубли создания бонусов






  const isRecord = count => {
    if (count > localStorage.timeCount) {
      localStorage.timeCount = count;
    }

    record.textContent = `Ваш рекорд ${localStorage.timeCount} секунд(ы)`;

  }

  column.forEach(el => {
    el.addEventListener('click', function () {
      if (values.includes(el.id)) {
        el.style.backgroundColor = '#66CC66';
        if (!data.includes(el.id)) {
          addTime.style.opacity = 1;
          addTime.style.color = '#66CC66';
          addTime.textContent = '+ 10 секунд'
          setTimeout(() => {
            addTime.style.opacity = 0;
          }, 1000)
          countTimer += 10000;
          data.push(el.id);
          isFinish(data)
        }
      } else {
        if (!data.includes(el.id)) {
          if (star.includes(el.id)) {
            console.log(0);
            el.style.backgroundColor = '#7c2222';
            const img = document.createElement('img');
            img.style.width = '32px';
            img.src = './img/star.png';
            const td = document.getElementById(`${el.id}`);
            td.classList.add('bonus');
            td.append(img)
            // 
            addTime.style.opacity = 1;
            addTime.style.color = '#7c2222';
            addTime.textContent = '+ 7 секунд'
            setTimeout(() => {
              addTime.style.opacity = 0;
            }, 1500)
            countTimer += 7000;

          } else if (bomb.includes(el.id)) {
            el.style.backgroundColor = 'orange';
            const img = document.createElement('img');
            img.style.width = '32px';
            img.src = './img/bomb.png';
            const td = document.getElementById(`${el.id}`);
            td.classList.add('bonus');
            td.append(img)
            // 
            addTime.style.opacity = 1;
            addTime.style.color = 'orange';
            addTime.textContent = 'Упс! - 3 секунды'
            setTimeout(() => {
              addTime.style.opacity = 0;
            }, 1500)
            countTimer -= 3000;
          } else if (luck.includes(el.id)) {
            el.style.backgroundColor = 'purple';
            const img = document.createElement('img');
            img.style.width = '32px';
            img.src = './img/luck.png';
            const td = document.getElementById(`${el.id}`);
            td.classList.add('bonus');
            td.append(img)
            // 
            addTime.style.opacity = 1;
            addTime.style.color = 'purple';
            addTime.textContent = 'Ого! Это большая удача'
            setTimeout(() => {
              addTime.style.opacity = 0;
            }, 1500)
          } else {
            el.style.backgroundColor = '#FF6666';
            addTime.style.opacity = 1;
            addTime.style.color = '#FF6666';
            addTime.textContent = '- 1 секунда'
            setTimeout(() => {
              addTime.style.opacity = 0;
              countTimer -= 1000;
            }, 500)
          }
        }
      }
    })
  })

  let interval = 1000;
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


  document.querySelectorAll('.content-promo').forEach(item => item.style.display = 'none')

})

reset.forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    clearInterval(timerId)
    table.style.backgroundColor = '#000';
    column.forEach(el => {
      el.innerHTML = '';
      el.style.backgroundColor = null;
      el.style.transitionDuration = '.5s';
      el.addEventListener('click', function () {
        el.style.backgroundColor = null;
      })
    })

    clearInterval(timerId)
    countTimer = 60000;
    modal.style.display = 'none';
    timer.textContent = 'Найдите все 10 плиток'

  })
})




const countBonus = value => {
  if (value === 'star') {
    return Math.round(Math.random() * 5);
  } else if (value === 'bomb') {
    return Math.round(Math.random() * 4);
  } else {
    return 1;
  }
}

