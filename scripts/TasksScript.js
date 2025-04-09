
const mainContainer = document.querySelector('main'); // Получаем ссылку на элемент <main> в HTML
const tasksContainer = document.createElement('div'); 
tasksContainer.classList.add('tasks-container'); 
mainContainer.appendChild(tasksContainer); // Добавляем tasksContainer в конец элемента mainContainer

function checkAnswer(inputElement, correctAnswer, listItem) { // Функция для проверки ответа пользователя

    const userAnswer = inputElement.value.trim().toLowerCase(); 
    let resultMessage = listItem.querySelector('.result-message'); // Пытаемся найти существующий элемент с классом 'result-message' внутри listItem
    if (!resultMessage) { 
        resultMessage = document.createElement('p'); 
        resultMessage.classList.add('result-message'); 
        listItem.appendChild(resultMessage); // Добавляем resultMessage в конец элемента listItem
    }
    const decisionButton = listItem.querySelector('.decision-button'); // Получаем кнопку "Показать решение"
    decisionButton.style.display = 'inline-block'; 

    if (userAnswer === correctAnswer) { 
        resultMessage.textContent = 'Правильно!'; 
        resultMessage.classList.remove('incorrect'); 
        resultMessage.classList.add('correct'); 

    } else { 
        resultMessage.textContent = `Неверно. Правильный ответ: ${correctAnswer}`; 
        resultMessage.classList.remove('correct');
        resultMessage.classList.add('incorrect'); 

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
  
  
async function renderThemeContent(contentContainer, themeTasks) {
    const isMobile = window.innerWidth <= 768;

    for (const subtheme in themeTasks) {
        const subthemeList = document.createElement('ul');
        subthemeList.classList.add('subtheme-list');
        const subthemeTitle = document.createElement('h3');
        subthemeTitle.textContent = subtheme;
        contentContainer.appendChild(subthemeTitle);
        contentContainer.appendChild(subthemeList);

        themeTasks[subtheme].forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('task-item');

            const taskNumber = document.createElement('span');
            taskNumber.textContent = `${index + 1} `;
            taskNumber.classList.add('task-number');
            listItem.appendChild(taskNumber);

            const imgContainer = document.createElement('div');
            imgContainer.classList.add('imgContainer');
            imgContainer.style.overflow = 'hidden';
            imgContainer.style.display = 'flex'; // Используем flexbox для центрирования
            imgContainer.style.justifyContent = 'center'; // Центрируем по горизонтали
            imgContainer.style.alignItems = 'center'; // Центрируем по вертикали

            listItem.appendChild(imgContainer);

            const image = document.createElement('img');
            image.src = task.image;
            image.alt = 'задание';
            image.classList.add('task-image');

            // Увеличиваем размер картинок и центрируем их на мобильных устройствах для определенных подтем
            if (isMobile && ["Найдите значение числового выражения", "Разложить на множители", "Решите систему уравнений", "Решите уравнение:"].includes(subtheme)) {
                image.style.width = '200%';
                image.style.maxWidth = 'none';
            }

            imgContainer.appendChild(image);

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Введите ответ';
            input.classList.add('answer-input');

            const answerButton = document.createElement('button');
            answerButton.textContent = 'Ответить';
            answerButton.classList.add('answer-button');
            answerButton.addEventListener('click', () => {
                checkAnswer(input, task.correctAnswer, listItem);
            });

            const decisionButton = document.createElement('button');
            decisionButton.textContent = 'Показать решение';
            decisionButton.classList.add('decision-button');
            decisionButton.addEventListener('click', () => {
                showDecision(task.decision, listItem);
            });
            decisionButton.style.display = 'none';


            listItem.appendChild(input);
            listItem.appendChild(answerButton);
            listItem.appendChild(decisionButton);

            subthemeList.appendChild(listItem);
        });
    }
}

async function loadQuizData() {
    const response = await fetch('quizData.json');
    const data = await response.json();
    return data;
}


document.addEventListener('DOMContentLoaded', async () => { // Добавляем обработчик события на загрузку DOM
   await renderThemes(); // Отображаем темы после загрузки DOM
});
