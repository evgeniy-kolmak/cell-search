const table = document.querySelector('table');
const row = document.querySelectorAll('tr');
const columnInRow = Array.from(row).map(el => Array.from(el.children));
const column = document.querySelectorAll('td');
const start = document.querySelector('.start');
const reset = document.querySelector('.reset');
const timer = document.querySelector('.timer');
const addTime = document.querySelector('.add-time');
let countTimer = 40000;
let timerId;

start.addEventListener('click', function (e) {
  e.preventDefault();
  table.style.backgroundColor = "#fff"
  table.style.transitionDuration = '1s'

  const addIdElements = () => {
    Array.from(row).map((element, index) => element.id = index)
    columnInRow.map((items, i) => {
      items.map((item, index) => item.id = `${i}${index}`)
    })
  }

  addIdElements();

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
  console.log(values);

  const data = [];

  const isFinish = data => {
    let count = 0;
    if (data.length === countCell) {
      count = countTimer / interval;
      clearInterval(timerId)
      timer.textContent = `Your times ${count} seconds`;

    }
  }

  column.forEach(el => {
    el.addEventListener('click', function () {
      if (values.includes(el.id)) {
        el.style.backgroundColor = '#66CC66';
        if (!data.includes(el.id)) {
          addTime.style.opacity = 1;
          // addTime.style.marginTop = '-20px';
          setTimeout(() => {
            // addTime.style.marginTop = '20px';
            addTime.style.opacity = 0;
          }, 1000)
          countTimer += 10000;
          data.push(el.id);
          isFinish(data)
        }
      } else {
        el.style.backgroundColor = '#FF6666';
      }
    })
  })

  let interval = 1000;
  timerId = setInterval(() => {
    countTimer -= interval;
    timer.textContent = `${countTimer / interval
      } seconds`;
    if (countTimer < interval) {
      timer.textContent = `Time is up`;
      clearInterval(timerId)
    }
  }, interval);

})

reset.addEventListener('click', function (e) {
  e.preventDefault();
  clearInterval(timerId)
  table.style.backgroundColor = '#000';
  column.forEach(el => {
    el.style.backgroundColor = null;
    el.style.transitionDuration = '.5s';
    el.addEventListener('click', function () {
      el.style.backgroundColor = null;
    })
  })
  clearInterval(timerId)
  countTimer = 40000;
  timer.textContent = 'Time';


})



