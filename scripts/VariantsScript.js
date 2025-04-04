
const semesterVariantsContainer = document.getElementById('semester-variants'); // Получаем ссылку на контейнер вариантов семестра
const generateButtons = document.querySelectorAll('.generate-button'); // Получаем все кнопки генерации вариантов
const submitSemesterButton = document.getElementById('submit-semester-button'); // Получаем ссылку на кнопку отправки варианта
const totalScoreDisplay = document.getElementById('total-score'); // Получаем ссылку на элемент для отображения результата

let currentVariantTasks = []; // Инициализируем пустой массив для хранения задач текущего варианта

async function loadQuizData() { // Асинхронная функция для загрузки данных викторины из файла
  const response = await fetch('quizData.json'); // Запрашиваем данные из файла quizData.json
  const data = await response.json(); // Преобразуем полученные данные в формат JSON
  return data; // Возвращаем полученные данные
}

function checkAnswer(inputElement, correctAnswer, listItem) { // Функция для проверки ответа пользователя
    const userAnswer = inputElement.value.trim().toLowerCase(); // Получаем ответ пользователя, удаляем пробелы и приводим к нижнему регистру
    let resultMessage = listItem.querySelector('.result-message'); // Ищем элемент для отображения результата
    if (!resultMessage) { // Если элемент для отображения результата не найден
        resultMessage = document.createElement('p'); // Создаем новый элемент <p>
        resultMessage.classList.add('result-message'); // Добавляем класс 'result-message'
        listItem.appendChild(resultMessage); // Добавляем элемент в список
    }
    const decisionButton = listItem.querySelector('.decision-button');
    decisionButton.style.display = 'inline-block'; // Показываем кнопку решения всегда!

    if (userAnswer === '') { // Если ответ пользователя пустой
        resultMessage.textContent = `Вы не ввели ответ. Правильный ответ: ${correctAnswer}`; // Выводим сообщение об отсутствии ответа
        resultMessage.classList.remove('correct'); // Удаляем класс 'correct'
        resultMessage.classList.add('incorrect'); // Добавляем класс 'incorrect'
    } else if (userAnswer === correctAnswer) { // Если ответ пользователя правильный
        resultMessage.textContent = 'Правильно!'; // Выводим сообщение о правильном ответе
        resultMessage.classList.remove('incorrect'); // Удаляем класс 'incorrect'
        resultMessage.classList.add('correct'); // Добавляем класс 'correct'
    } else { // Если ответ пользователя неправильный
        resultMessage.textContent = `Неверно. Правильный ответ: ${correctAnswer}`; // Выводим сообщение о неправильном ответе и правильный ответ
        resultMessage.classList.remove('correct'); // Удаляем класс 'correct'
        resultMessage.classList.add('incorrect'); // Добавляем класс 'incorrect'
    }
}

function showDecision(decisionImage, listItem) { // Функция для отображения картинки решения
    let existingImage = listItem.querySelector('.solution-image'); // Проверяем, есть ли уже картинка решения
    if (existingImage){ // Если картинка решения уже есть
        existingImage.remove(); // Удаляем старую картинку
        return; // Выходим из функции
    }
    const image = document.createElement('img'); // Создаем элемент <img>
    image.src = decisionImage; // Устанавливаем атрибут src
    image.alt = 'Решение'; // Устанавливаем атрибут alt
    image.classList.add('solution-image'); // Добавляем класс 'solution-image'
    listItem.appendChild(image); // Добавляем картинку в элемент списка
}

async function generateSemesterVariant(variantNumber) { // Асинхронная функция для генерации варианта семестра
  const quizData = await loadQuizData(); // Загружаем данные викторины
  currentVariantTasks = []; // Очищаем массив текущих задач варианта
  semesterVariantsContainer.innerHTML = ''; // Очищаем контейнер вариантов семестра
  const groupedTasks = quizData.reduce((acc, task) => { // Группируем задачи по темам и подтемам
      if (!acc[task.theme]) { // Если темы еще нет в аккумуляторе
          acc[task.theme] = {}; // Создаем объект для темы
      }
      if (!acc[task.theme][task.subtheme]) { // Если подтемы еще нет в теме
          acc[task.theme][task.subtheme] = []; // Создаем массив для подтемы
      }
      acc[task.theme][task.subtheme].push(task); // Добавляем задачу в подтему
      return acc; // Возвращаем аккумулятор
  }, {});
  const variantContainer = document.createElement('div') // Создаем контейнер варианта
  variantContainer.classList.add('tasks-container'); // Добавляем класс 'tasks-container'
  
  const themeContainer = document.createElement('div') // Создаем контейнер темы
  themeContainer.classList.add('theme-container'); // Добавляем класс 'theme-container'
  
  const variantTitle = document.createElement('h2'); // Создаем заголовок варианта
  variantTitle.textContent = `Вариант ${variantNumber}`; // Устанавливаем текст заголовка
  
  themeContainer.appendChild(variantTitle) // Добавляем заголовок в контейнер темы
  variantContainer.appendChild(themeContainer) // Добавляем контейнер темы в контейнер варианта
  semesterVariantsContainer.appendChild(variantContainer) // Добавляем контейнер варианта в контейнер вариантов семестра
  
  let taskNumberInVariant = 1; // Инициализируем номер задачи в варианте
  for (const theme in groupedTasks) { // Перебираем темы

      for (const subtheme in groupedTasks[theme]) { // Перебираем подтемы
          const subthemeList = document.createElement('ul'); // Создаем список подтемы
          subthemeList.classList.add('subtheme-list'); // Добавляем класс 'subtheme-list'
           const subthemeTitle = document.createElement('h4'); // Создаем заголовок подтемы
           const taskNumber = document.createElement('span'); // Создаем элемент для номера задачи
            taskNumber.textContent = `${taskNumberInVariant}. `; // Устанавливаем текст номера задачи
            taskNumber.classList.add('subtheme-number'); // Добавляем класс 'subtheme-number'
            subthemeTitle.appendChild(taskNumber); // Добавляем номер задачи в заголовок подтемы
           subthemeTitle.append(subtheme); // Добавляем название подтемы

           themeContainer.appendChild(subthemeTitle); // Добавляем заголовок подтемы в контейнер темы
           themeContainer.appendChild(subthemeList); // Добавляем список подтемы в контейнер темы
          const tasksForSubtheme = groupedTasks[theme][subtheme]; // Получаем задачи для подтемы
          const taskForVariant = tasksForSubtheme.find(task => task.number == variantNumber); // Ищем задачу для текущего варианта
          let listItem = document.createElement('li'); // Создаем элемент списка
          listItem.classList.add('task-item'); // Добавляем класс 'task-item'
          if (taskForVariant) { // Если задача для варианта найдена
              currentVariantTasks.push(taskForVariant); // Добавляем задачу в массив текущих задач варианта
              const image = document.createElement('img'); // Создаем элемент <img>
              image.src = taskForVariant.image; // Устанавливаем атрибут src
              image.alt = 'задание'; // Устанавливаем атрибут alt
              image.classList.add('task-image'); // Добавляем класс 'task-image'
              const input = document.createElement('input'); // Создаем элемент <input>
              input.type = 'text'; // Устанавливаем тип 'text'
              input.placeholder = 'Введите ответ'; // Устанавливаем placeholder
              input.classList.add('answer-input'); // Добавляем класс 'answer-input'

              const decisionButton = document.createElement('button'); // Создаем кнопку "Показать решение"
              decisionButton.textContent = 'Показать решение'; // Устанавливаем текст кнопки
              decisionButton.classList.add('decision-button'); // Добавляем класс 'decision-button'
              decisionButton.style.display = 'none';  //Скрыть кнопку изначально

              decisionButton.addEventListener('click', () => showDecision(taskForVariant.decision, listItem)); // Вешаем обработчик клика на кнопку решения


              listItem.appendChild(image); // Добавляем изображение в элемент списка
              listItem.appendChild(input); // Добавляем поле ввода в элемент списка
              listItem.appendChild(decisionButton); // Добавляем кнопку решения в элемент списка
          } else { // Если задача для варианта не найдена
               listItem.textContent = 'Задание для данного варианта не найдено'; // Выводим сообщение об отсутствии задачи
          }
            subthemeList.appendChild(listItem); // Добавляем элемент списка в список подтемы
           taskNumberInVariant++; // Увеличиваем номер задачи в варианте
      }
  }
  submitSemesterButton.style.display = 'inline-block'; // Показываем кнопку отправки варианта
  totalScoreDisplay.style.display = 'none'; // Скрываем элемент отображения результата
}

function calculateScore() { // Функция для расчета результата
    let correctAnswersCount = 0; // Инициализируем счетчик правильных ответов
    const taskItems = semesterVariantsContainer.querySelectorAll('.task-item'); // Получаем все элементы задач
    taskItems.forEach((listItem, index) => { // Перебираем элементы задач
      const input = listItem.querySelector('.answer-input'); // Получаем поле ввода ответа
         const task = currentVariantTasks[index]; // Получаем текущую задачу
        if (task && input) { // Если задача и поле ввода существуют
           checkAnswer(input, task.correctAnswer, listItem); // Проверяем ответ пользователя
           const userAnswer = input.value.trim().toLowerCase(); // Получаем ответ пользователя, удаляем пробелы и приводим к нижнему регистру
           if (userAnswer === task.correctAnswer) { // Если ответ пользователя правильный
               correctAnswersCount++; // Увеличиваем счетчик правильных ответов
            }
        }
    });

     totalScoreDisplay.textContent = `Вы ответили правильно на ${correctAnswersCount} из ${currentVariantTasks.length} заданий.`; // Выводим результат
    totalScoreDisplay.style.display = 'block'; // Показываем элемент отображения результата
}


generateButtons.forEach(button => { // Перебираем все кнопки генерации
    button.addEventListener('click', function () { // Вешаем обработчик клика на каждую кнопку
        const variantNumber = this.dataset.variant; // Получаем номер варианта из атрибута data-variant
        generateSemesterVariant(variantNumber); // Генерируем вариант семестра
    });
});

submitSemesterButton.addEventListener('click', calculateScore); // Вешаем обработчик клика на кнопку отправки варианта
