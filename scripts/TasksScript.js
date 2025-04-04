
const mainContainer = document.querySelector('main'); // Получаем ссылку на элемент <main> в HTML
const tasksContainer = document.createElement('div'); // Создаем новый элемент <div>
tasksContainer.classList.add('tasks-container'); // Добавляем класс 'tasks-container' к созданному элементу
mainContainer.appendChild(tasksContainer); // Добавляем tasksContainer в конец элемента mainContainer

function checkAnswer(inputElement, correctAnswer, listItem) { // Функция для проверки ответа пользователя

    const userAnswer = inputElement.value.trim().toLowerCase(); // Получаем ответ пользователя, удаляем пробелы и приводим к нижнему регистру
    let resultMessage = listItem.querySelector('.result-message'); // Пытаемся найти существующий элемент с классом 'result-message' внутри listItem
    if (!resultMessage) { // Если элемент с классом 'result-message' не найден
        resultMessage = document.createElement('p'); // Создаем новый элемент <p>
        resultMessage.classList.add('result-message'); // Добавляем класс 'result-message' к созданному элементу
        listItem.appendChild(resultMessage); // Добавляем resultMessage в конец элемента listItem
    }
    const decisionButton = listItem.querySelector('.decision-button'); // Получаем кнопку "Показать решение"
    decisionButton.style.display = 'inline-block'; // Отображаем кнопку решения

    if (userAnswer === correctAnswer) { // Если ответ пользователя совпадает с правильным ответом
        resultMessage.textContent = 'Правильно!'; // Устанавливаем текст сообщения о результате
        resultMessage.classList.remove('incorrect'); // Удаляем класс 'incorrect'
        resultMessage.classList.add('correct'); // Добавляем класс 'correct'

    } else { // Если ответ пользователя не совпадает с правильным ответом
        resultMessage.textContent = `Неверно. Правильный ответ: ${correctAnswer}`; // Устанавливаем текст сообщения о результате с правильным ответом
        resultMessage.classList.remove('correct'); // Удаляем класс 'correct'
        resultMessage.classList.add('incorrect'); // Добавляем класс 'incorrect'

    }

}




function showDecision(decisionImage, listItem) { // Функция для показа изображения решения
    let existingImage = listItem.querySelector('.solution-image'); // Ищем, есть ли уже показанное решение
    if (existingImage){ // Если решение уже показано
        existingImage.remove(); // Удаляем текущее изображение решения
        return; // Выходим из функции
    }
    const image = document.createElement('img'); // Создаем новый элемент <img>
    image.src = decisionImage; // Устанавливаем атрибут src изображения
    image.alt = 'Решение'; // Устанавливаем атрибут alt изображения
    image.classList.add('solution-image'); // Добавляем класс 'solution-image' к созданному элементу
    listItem.appendChild(image); // Добавляем изображение в конец элемента listItem
}

async function renderThemes() { // Асинхронная функция для отображения тем
    const quizData = await loadQuizData(); // Загружаем данные викторины

    const groupedTasks = quizData.reduce((acc, task) => { // Группируем задачи по темам и подтемам
        if (!acc[task.theme]) { // Если тема еще не существует в аккумуляторе
            acc[task.theme] = {}; // Создаем новую запись для темы
        }
        if (!acc[task.theme][task.subtheme]) { // Если подтема еще не существует в теме
             acc[task.theme][task.subtheme] = []; // Создаем новую запись для подтемы
        }
        acc[task.theme][task.subtheme].push(task); // Добавляем задачу в подтему
        return acc; // Возвращаем аккумулятор
    }, {});

    for (const theme in groupedTasks) { // Перебираем темы
        const themeContainer = document.createElement('div'); // Создаем контейнер для темы
        themeContainer.classList.add('theme-container'); // Добавляем класс для стилизации контейнера темы
        themeContainer.classList.add('collapsible'); // Делаем тему сворачиваемой
        const themeTitle = document.createElement('h2'); // Создаем заголовок для темы
        themeTitle.textContent = theme; // Устанавливаем текст заголовка темы
        themeTitle.classList.add('theme-title'); // Добавляем класс для стилизации заголовка темы
        themeContainer.appendChild(themeTitle); // Добавляем заголовок в контейнер темы
        tasksContainer.appendChild(themeContainer); // Добавляем контейнер темы в контейнер задач

        themeTitle.addEventListener('click', function(event) { // Слушаем клик именно на заголовке темы
            // Проверяем, активна ли тема
            const isActive = themeContainer.classList.contains('active');

            // Сворачиваем все остальные темы и удаляем их содержимое
            const collapsibles = document.querySelectorAll('.collapsible');
            collapsibles.forEach(otherCollapsible => {
                if (otherCollapsible !== themeContainer) {
                    otherCollapsible.classList.remove('active');
                    const content = otherCollapsible.querySelector('.content');
                    if (content) {
                        content.remove(); // Удаляем содержимое
                    }
                }
            });

            if (isActive) {
                // Если тема уже активна, то сворачиваем ее и удаляем содержимое
                themeContainer.classList.remove('active');
                const content = themeContainer.querySelector('.content');
                if (content) {
                    content.remove(); // Удаляем содержимое
                }
            } else {
                // Если тема не активна, то разворачиваем ее и генерируем контент
                themeContainer.classList.add('active');
                const content = document.createElement('div');
                content.classList.add('content');
                themeContainer.appendChild(content);
                renderThemeContent(content, groupedTasks[theme]);
            }
        });
    }
}

function adjustImageSize(image, parentElement) {
    image.onload = () => {
      const originalWidth = image.width;
      const isMobile = window.innerWidth <= 768;
  
      // Большая картинка на телефоне: maxWidth = 90vw
      if (isMobile && originalWidth >= 1500) {
        image.style.maxWidth = '90vw';
        image.style.height = 'auto';
        console.log("Большая картинка на телефоне: maxWidth = 90vw");
      }
      // Маленькая картинка на телефоне: maxWidth = 33vw
      else if (isMobile && originalWidth < 1500) {
        image.style.maxWidth = '33vw';
        image.style.height = 'auto';
        console.log("Маленькая картинка на телефоне: maxWidth = 33vw");
      }
      // Для десктопа:  Автоматические размеры
      else {
        image.style.maxWidth = 'auto';
        image.style.maxHeight = 'auto';
        console.log("Десктоп: авторазмеры");
      }
    };
  }
  
//   function adjustImageSize(image, parentElement) {
//     image.onload = () => {
//       const originalWidth = image.width;
//       const isMobile = window.innerWidth <= 768;
  
//       let maxWidth; // Объявляем переменную для maxWidth
//       let height = 'auto'; // Высота всегда auto, определяем сразу
  
//       // Определяем maxWidth в зависимости от условий
//       if (isMobile && originalWidth >= 1500) {
//         maxWidth = '90vw';
//         console.log("Большая картинка на телефоне: maxWidth = 90vw");
//       } else if (isMobile && originalWidth < 1500) {
//         maxWidth = '33vw';
//         console.log("Маленькая картинка на телефоне: maxWidth = 33vw");
//       } else {
//         maxWidth = 'auto';
//         height = 'auto'; // Для десктопа и высота auto
//         console.log("Десктоп: авторазмеры");
//       }
  
//       // Применяем стили к изображению после всех вычислений
//       image.style.maxWidth = maxWidth;
//       image.style.height = height;
//     };
//   }
  
  
async function renderThemeContent(contentContainer, themeTasks) { // Функция для отображения контента темы
    for (const subtheme in themeTasks) { // Перебираем подтемы
        const subthemeList = document.createElement('ul'); // Создаем список для подтемы
        subthemeList.classList.add('subtheme-list'); // Добавляем класс для стилизации списка подтемы
        const subthemeTitle = document.createElement('h3'); // Создаем заголовок для подтемы
        subthemeTitle.textContent = subtheme; // Устанавливаем текст заголовка подтемы
        contentContainer.appendChild(subthemeTitle); // Добавляем заголовок подтемы в контейнер контента
        contentContainer.appendChild(subthemeList); // Добавляем список подтемы в контейнер контента

        themeTasks[subtheme].forEach((task, index) => { // Перебираем задачи в подтеме
            const listItem = document.createElement('li'); // Создаем элемент списка для задачи
            listItem.classList.add('task-item'); // Добавляем класс для стилизации элемента списка задачи

            const taskNumber = document.createElement('span'); // Создаем элемент для отображения номера задачи
            taskNumber.textContent = `${index + 1} `; // Устанавливаем текст номера задачи
            taskNumber.classList.add('task-number'); // Добавляем класс для стилизации номера задачи
            listItem.appendChild(taskNumber); // Добавляем номер задачи в элемент списка

            const imgContainer = document.createElement('div'); // Создаем контейнер для картинки задачи

            const image = document.createElement('img'); // Создаем элемент изображения

// adjustImageSize(image, imgContainer); 


            image.src = task.image; // Устанавливаем путь к изображению
            image.alt = 'задание'; // Устанавливаем alt текст
            image.classList.add('task-image'); // Добавляем класс для стилизации изображения

            const input = document.createElement('input'); // Создаем поле ввода для ответа
            input.type = 'text'; // Устанавливаем тип поля ввода
            input.placeholder = 'Введите ответ'; // Устанавливаем текст-подсказку
            input.classList.add('answer-input'); // Добавляем класс для стилизации поля ввода

            const answerButton = document.createElement('button'); // Создаем кнопку для отправки ответа
            answerButton.textContent = 'Ответить'; // Устанавливаем текст кнопки
            answerButton.classList.add('answer-button'); // Добавляем класс для стилизации кнопки
            answerButton.addEventListener('click', () => { // Добавляем обработчик события на клик
                checkAnswer(input, task.correctAnswer, listItem); // Проверяем ответ
            });

            const decisionButton = document.createElement('button'); // Создаем кнопку "Показать решение"
            decisionButton.textContent = 'Показать решение'; // Устанавливаем текст кнопки
            decisionButton.classList.add('decision-button'); // Добавляем класс для стилизации кнопки
            decisionButton.addEventListener('click', () => { // Добавляем обработчик события на клик
                showDecision(task.decision, listItem); // Показываем решение
            });
            decisionButton.style.display = 'none'; // Скрываем кнопку "Показать решение"

            imgContainer.appendChild(image); // Добавляем изображение в контейнер

            imgContainer.classList.add('imgContainer'); // Добавляем класс для стилизации контейнера
            listItem.appendChild(imgContainer); // Добавляем контейнер изображения в элемент списка
            listItem.appendChild(input); // Добавляем поле ввода в элемент списка
            listItem.appendChild(answerButton); // Добавляем кнопку отправки в элемент списка
            listItem.appendChild(decisionButton); // Добавляем кнопку решения в элемент списка

            subthemeList.appendChild(listItem); // Добавляем элемент списка в список подтемы
        });
    }
}

async function loadQuizData() { // Асинхронная функция для загрузки данных викторины из JSON файла
    const response = await fetch('quizData.json'); // Выполняем HTTP запрос к файлу quizData.json
    const data = await response.json(); // Преобразуем полученный ответ в JSON формат
    return data; // Возвращаем полученные данные
}

document.addEventListener('DOMContentLoaded', async () => { // Добавляем обработчик события на загрузку DOM
   await renderThemes(); // Отображаем темы после загрузки DOM
});
