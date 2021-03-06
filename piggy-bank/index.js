import moment from 'moment';
// moment().format();
// console.log(moment().format())

// Наш массив для сохранённых целей.  Сюда будут попадать все наши сохранённые цели    (При клике на кнопку "Сохранить" в форме)
let arrForOurSaveTargets = []




let goalName = document.querySelector('#goal-name');
let sumRequired = document.querySelector('#sum-required');
let period = document.querySelector('#period');
let initialSum = document.querySelector('#initial-sum');
let percent = document.querySelector('#percent');
let monthlyPayment = document.querySelector('#monthly-payment');
let formSaveBtn = document.querySelector('#form-save-btn');
let formCancelBtn = document.querySelector('#form-cancel-btn');
let activeCardDataID = null;
let savedGoals = document.querySelector('#saved-goals');


// Спаны с сообщениями об ошибках при вводе данных
let spanErrorTime = document.querySelector('#error-message1');

let spanErrorEmptyInputs = document.querySelector('#error-message2');


// Сама форма form 
let form = document.querySelector('#goal-form');


// Список целей.  В правой части экрана 
let targetsList = document.querySelector('#saved-goals');







// Написать функцию  которая возвращает количество месяцев от текущего месяца  до   месяца, который ввёл пользователь
function calcMonths() {

    let start =  moment().format('MM-YYYY')
    let end = period.value;
    let a = moment(start, "MM-YYYY");
    let b = moment(end, "MM-YYYY");
    let  months = b.diff(a, 'month');

    if (months > 0) {
        console.log(months) 
        // spanErrorTime.style.visibility = "hidden"

        return months;
    } else {
        // spanErrorTime.style.visibility = "visible"
        // alert('Введите корректную актуальную дату ')
    }  
}

// Проверяет - действительно ли пользователь ввёл корректную дату (обозримое будущее)
function isCorrectDate() {

  let start =  moment().format('MM-YYYY')
  let end = period.value;
  let a = moment(start, "MM-YYYY");
  let b = moment(end, "MM-YYYY");
  let  months = b.diff(a, 'month');

  if (months > 0) {
      return true;
  } else {
    return false;

  }  
}




// Функция, которая проверяет - заполнены ли все 5 инпутов. Функция срабатывает   при каждом  ВВОДЕ данных    в  ЛЮБОЙ  из пяти инпутов
function isEmptyInputs() {

  // Когда мы только начинаем что-то вводить ,  в самом низу формы  должна  появиться  плашка "Пожалуйста, заполните все поля"   
  spanErrorEmptyInputs.style.visibility = "visible"

  if( goalName.value.trim() !== "" && sumRequired.value.trim() !== "" && period.value.trim() !== "" && period.value.length >= 6 && initialSum.value.trim() !== ""&& percent.value.trim() !== "" ) {

  spanErrorEmptyInputs.style.visibility = "hidden"

    // console.log("Все поля заполнены" )

    // Теперь здесь запускаем функцию , которая РАССЧИТЫВАЕТ размер ежемесячного пополнения   и  ВЫВОДИТ его , как результат,   в инпут   monthlyPayment
    calculatedSumOfPaymant()
  }

  // В противном случае, если хотя бы один из инпутов НЕ пустой, то ничего не срабатывает
  else if ( goalName.value.trim() !== "" || sumRequired.value.trim() !== "" || period.value.trim() !== "" || period.value.length >= 6 || initialSum.value.trim() !== ""|| 
  percent.value.trim() !== "") {
    monthlyPayment.value = "";
    console.log("Одно из полей пустое")
  }
  
  // В противном случае, если мы впервые начали что-то вводить в инпут, а затем из этого инпута стёрли всё что ввели, плашка "Пожалуйста, заполните все поля"    ДОЛЖНА  пропасть
  else if(goalName.value.trim() == "" && sumRequired.value.trim() == "" && period.value.trim() == "" && initialSum.value.trim() == "" && percent.value.trim() == "") {

    spanErrorEmptyInputs.style.visibility = "hidden"
    spanErrorTime.style.visibility = "hidden"
  
  }

}



// Функция, которая работает  ТОЛЬКО   с  инпутом  "Срок:".  Функция, проверяет введённое пользователем значение на соответствие формату ММ-ГГГГ
function validationTime(event) {

  // // При каждом вводе проверяем - корректная ли дата
  // let isCorrectDate = isCorrectDate()

  let reg = /((0|1)[1-9]|10)-202[1-9]/

  // Когда мы ввели ДАТУ в корректном формате  ММ-ГГГГ, нужно проверить - соответствует ли дата условию "обозримое будущее"
  if(reg.test(event.target.value) && event.target.value.length == 7) {

      // При каждом вводе проверяем - корректная ли дата
    let isCorrectDat = isCorrectDate()

    if(isCorrectDat) {
      console.log("Соответствует")
      spanErrorTime.style.visibility = "hidden"
    } else {
      spanErrorTime.style.visibility = "visible"

    }

  }


  else if(event.target.value == "") {

    spanErrorTime.style.visibility = "hidden"

  }

  // Когда мы ТОЛЬКО начали что то вводить в инпут СРОК
  else {
    spanErrorTime.style.visibility = "visible"
  }


}


// Когда 4 полей заполнены
// Функция берёт значения 4 инпутов (требуемая сумма, период, начальная сумма, процент)   и на их основе рассчитывает размер ежемесячного платежа и выводит его в инпут monthlyPayment
function calculatedSumOfPaymant() {


  let someMonth = calcMonths()


  // Итоговый доход (берём его из инпута sumRequired "Требуемая сумма"  ). Допустим 80 000 р
  let sumRequire = sumRequired.value

  // Начальный депозит. Берём из инпута.  Например, у нас в самом начале было 5000р, и мы их положили в банк, как вклад 
  let initialSumm = initialSum.value

  // Процентная ставка. Допустим  6%
  let percen = percent.value

  // Получаем коэффициент 
  let koeff = ( 1 + ( percen / 100 / 12 ) )**someMonth

  console.log("Коэффициент koeff", koeff)


  // Получаем начальный депозит (по формуле).   Например, получим 77 641, 446237102.   И от этого значения отнимем те средства, которые мы уже положили на вклад (5000 руб.)
  let initiaDeposite = ( sumRequire / koeff ) - initialSumm

  console.log("Начальный депозит, по формуле", initiaDeposite)


  // Получаем ежемесячный платёж.   

  // например, при требуемой сумме 80 000 р,  и начальном депозите в 5 000 р.   РАЗМЕР ЕЖЕМЕСЯЧНОГО ПОПОЛНЕНИЯ      В ТЕЧЕНИЕ 6 МЕСЯЦЕВ     СОСТАВИТ  12.106907706183 Р

  let monthlyPaymen = initiaDeposite / someMonth
  
  console.log("Размер ежемесячного платежа", monthlyPaymen)

  // Вставили в инпут результат рассчётов
  monthlyPayment.value = Number(monthlyPaymen).toFixed(2)

};

function expandСollapse (event) {
  if ((event.target.closest('.arrow')) && (event.target.closest('.arrow').dataset.collapsed === 'false')) {

    let cards = event.currentTarget.querySelectorAll('.target-card');
    cards.forEach((card)=> {
      card.querySelector('.arrow').dataset.collapsed = 'false';
      card.querySelector('.target-card-hidden-block').style.display = 'none';
      card.querySelector('.arrow').style.transform = 'rotate(360deg)';
    });

    event.target.closest('.arrow').dataset.collapsed = 'true';
    event.target.closest('.target-card').querySelector('.target-card-hidden-block').style.display = 'block';
    event.target.closest('.arrow').style.transform = 'rotate(180deg)';

  } else if ((event.target.closest('.arrow')) && (event.target.closest('.arrow').dataset.collapsed === 'true')) {

    event.target.closest('.arrow').dataset.collapsed = 'false';
    event.target.closest('.target-card').querySelector('.target-card-hidden-block').style.display = 'none';
    event.target.closest('.arrow').style.transform = 'rotate(360deg)';

  }
};



function removeGoal(dataId2) {
  let newArray = arrForOurSaveTargets.filter((card2) => {
      if (card2.id != dataId2) {
          return card2;     
       }
  })
  arrForOurSaveTargets = newArray;
  renderTargetInRightList(arrForOurSaveTargets);
};

function updateGoal(dataId) {
  // в массиве найти элемент у к-го эл-т равен data-id
  activeCardDataID = dataId;
  let targetCard = arrForOurSaveTargets.find((card) => {
    if (card.id == dataId) { 
    return card;
    }
  })

  goalName.value = targetCard.goalName;
  sumRequired.value = targetCard.sumRequired;
  period.value = targetCard.period;
  initialSum.value = targetCard.initialSum;
  percent.value = targetCard.percent;
  monthlyPayment.value = targetCard.monthlyPayment;
}




// Функция, которая СОХРАНЯЕТ цель.   Сохраняет в виде объекта и пушит в массив arrForOurSaveTargets
function saveOurTargetInTargetsArray() {

  // В случае, если все наши поля были заполнены...
  if( goalName.value.trim() !== "" && sumRequired.value.trim() !== "" && period.value.trim() !== "" && period.value.length >= 6 && initialSum.value.trim() !== ""&& 
  percent.value.trim() !== "" && monthlyPayment.value.trim()  !== "") {

  
    //...мы можем сформировать объект 
    let targetObj = {

      id: Date.now(),

      goalName: goalName.value,

      sumRequired: sumRequired.value,

      period: period.value,

      initialSum: initialSum.value,

      percent: percent.value,

      monthlyPayment: monthlyPayment.value,

    }

    if(activeCardDataID !== null) {
      arrForOurSaveTargets = arrForOurSaveTargets.filter((card2) => {
        if (card2.id != activeCardDataID) {
            return card2;     
        }
      })
      activeCardDataID = null;
    }

    // .. и теперь, когда мы сформировали объект с данными по нашей цели,  мы можем запушить этот объект в массив (где будут храниться ВСЕ наши цели)
    arrForOurSaveTargets.push(targetObj)

    // А вот здесь будет срабатывать функция, которая удаляет из массива-целей   ДУБЛИКАТЫ
    let newTargetsArrayWithoutDublicates = removeDuplicates(arrForOurSaveTargets)

    console.log("Массив без дубликатов newTargetsArrayWithoutDublicates", newTargetsArrayWithoutDublicates)

    // Форма очищается от прежних введённых в неё значений 
    form.reset()


    // А здесь отработает функция, которая смотрит на массив-целей, перебирает его и для каждой цели рисует карточку  (в правой части экрана)
    renderTargetInRightList(newTargetsArrayWithoutDublicates)

  }
}


// Функция, которая удаляет из массива-целей дубликаты.  Что имеется в виду под дубликатами: допустим, пользователь, когда заполнил форму, нажал на кнопку "Сохранить" два или три раза подряд.

// И, чтобы в массиве одинаковые объекты не дублировались, мы удаляем эти дубликаты ,   ПРЕЖДЕ ЧЕМ сработает функция,   которая рисует разметку - перебирая массив целей


function removeDuplicates(arr) {

  const result = [];
  const duplicatesIndices = [];

  // Перебираем каждый элемент в исходном массиве
  arr.forEach((current, index) => {
  
      if (duplicatesIndices.includes(index)) return;
  
      result.push(current);
  
      // Сравниваем каждый элемент в массиве после текущего
      for (let comparisonIndex = index + 1; comparisonIndex < arr.length; comparisonIndex++) {
      
          const comparison = arr[comparisonIndex];
          const currentKeys = Object.keys(current);
          const comparisonKeys = Object.keys(comparison);
          
          // Проверяем длину массивов
          if (currentKeys.length !== comparisonKeys.length) continue;
          
          // Проверяем значение ключей
          const currentKeysString = currentKeys.sort().join("").toLowerCase();
          const comparisonKeysString = comparisonKeys.sort().join("").toLowerCase();
          if (currentKeysString !== comparisonKeysString) continue;
          
          // Проверяем индексы ключей
          let valuesEqual = true;
          for (let i = 0; i < currentKeys.length; i++) {
              const key = currentKeys[i];
              if ( current[key] !== comparison[key] ) {
                  valuesEqual = false;
                  break;
              }
          }
          if (valuesEqual) duplicatesIndices.push(comparisonIndex);
          
      } // Конец цикла
  });  

  console.log("Нам массив целей БЕЗ дубликатов", result)

  return result;
}



// Функция, которая берёт очищенный от дубликатов массив-целей ,   перебирает его и для каждого объекта,  то есть для каждой цели - рисует  карточку в списке, 
// который находится в правой части экрана
function renderTargetInRightList(newTargetsArrayWithoutDublicates) {

  targetsList.innerHTML = ""
  

  newTargetsArrayWithoutDublicates.forEach( target => {
    let targetHTML = `
                    <div class="target-card" data-id=${target.id}>
                      <div class="target-card-title-and-arrow">
                        <p class="target-card-title">${target.goalName}</p>
                        <div class="arrow" data-collapsed="false">
                          <svg class="arrow-to-down" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                          width="15px" height="15px" viewBox="0 0 306 306" style="enable-background:new 0 0 306 306;" xml:space="preserve">
                          <g><g id="expand-more">
                              <polygon points="270.3,58.65 153,175.95 35.7,58.65 0,94.35 153,247.35 306,94.35 "/>
                            </g></g>
                          </svg>
                        </div>
                      </div>
                      <div class="target-card-hidden-block">
                        <p>Необходимая сумма: ${target.sumRequired}</p>
                        <p>Срок: ${target.period}</p>
                        <p class="target-card-initial-sum">Стартовая сумма: ${target.initialSum}</p>
                        <p class="target-card-percent">Процент по вкладу: ${target.percent} %</p>
                        <p class="target-card-monthly-payment">Ежемесячный платёж: ${target.monthlyPayment}</p>
                        <div class="target-card-row-for-buttons">
                          <button type="button" class="changeCardBtn target-card-change-btn cardBtn">Изменить</button>
                          <button type="button" class="deleteCardBtn target-card-remove-btn cardBtn">Удалить</button>
                        </div>
                      </div>
                      <!-- // Скрытый блок, который появляется-выезжает   при наведении на  карточку -->
                    </div>`
    
        

    // Теперь эту разметку карточки нужно физически вставить на страницу -->  в список наших целей
    targetsList.insertAdjacentHTML("beforeend", targetHTML)

  })

  document.querySelectorAll('.target-card').forEach((card2) => {
    let removeBtn = card2.querySelector('.target-card-remove-btn');
    let dataId2 = card2.dataset.id
    removeBtn.addEventListener("click", () => removeGoal(dataId2))
  })

  document.querySelectorAll('.target-card').forEach((card) => {
    let changeBtn = card.querySelector('.target-card-change-btn')
    let dataId = card.dataset.id
    console.log(dataId)
  
    changeBtn.addEventListener("click", () => updateGoal(dataId));
  })
}


// Функция, которая при нажатии на кнопку ОТМЕНА  очищает форму
function resetForm() {
  form.reset()
  activeCardDataID = null;
}







// Навешиваю обработчики
goalName.addEventListener("input", isEmptyInputs)

sumRequired.addEventListener("input", isEmptyInputs)

period.addEventListener("input", isEmptyInputs)

period.addEventListener("input", validationTime)

initialSum.addEventListener("input", isEmptyInputs)

percent.addEventListener("input", isEmptyInputs)

formSaveBtn.addEventListener("click", saveOurTargetInTargetsArray)

formCancelBtn.addEventListener("click", resetForm)

savedGoals.addEventListener("click", expandСollapse)
