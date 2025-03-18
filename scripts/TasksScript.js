
const mainContainer = document.querySelector('main');
const tasksContainer = document.createElement('div');
tasksContainer.classList.add('tasks-container');
mainContainer.appendChild(tasksContainer);

function checkAnswer(inputElement, correctAnswer, listItem) {
    const userAnswer = inputElement.value.trim().toLowerCase();
    let resultMessage = listItem.querySelector('.result-message');
    if (!resultMessage) {
        resultMessage = document.createElement('p');
        resultMessage.classList.add('result-message');
        listItem.appendChild(resultMessage);
    }
    const decisionButton = listItem.querySelector('.decision-button');
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




function showDecision(decisionImage, listItem) {
    let existingImage = listItem.querySelector('.solution-image');
    if (existingImage){
        existingImage.remove();
        return;
    }
    const image = document.createElement('img');
    image.src = decisionImage;
    image.alt = 'Решение';
    image.classList.add('solution-image');
    listItem.appendChild(image);
}

async function renderThemes() {
    const quizData = await loadQuizData();

    const groupedTasks = quizData.reduce((acc, task) => {
        if (!acc[task.theme]) {
            acc[task.theme] = {};
        }
        if (!acc[task.theme][task.subtheme]) {
             acc[task.theme][task.subtheme] = [];
        }
        acc[task.theme][task.subtheme].push(task);
        return acc;
    }, {});

    for (const theme in groupedTasks) {
        const themeContainer = document.createElement('div');
        themeContainer.classList.add('theme-container');
        themeContainer.classList.add('collapsible');
        const themeTitle = document.createElement('h2');
        themeTitle.textContent = theme;
        themeTitle.classList.add('theme-title');
        themeContainer.appendChild(themeTitle);
        tasksContainer.appendChild(themeContainer);

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
        const originalHeight = image.height;

        // Оригинальный размер шрифта (высота строчных букв)
        const originalFontSizePixels = 25;

        // Желаемый размер шрифта
        const targetFontSizePixels = 9;

        // Вычисляем коэффициент масштабирования, чтобы изменить размер шрифта
        const fontSizeScaleFactor = targetFontSizePixels / originalFontSizePixels;

        // Вычисляем коэффициент масштабирования для изображения в целом
        // Важно: мы масштабируем *всё* изображение, чтобы пропорционально уменьшить и текст.
        const scaleFactor = fontSizeScaleFactor;


        // console.log("Original Width:", originalWidth);
        // console.log("Original Height:", originalHeight);
        // console.log("Font Size Scale Factor:", fontSizeScaleFactor);
        // console.log("Scale Factor:", scaleFactor);

        // Устанавливаем максимальную ширину и высоту изображения.  Важно использовать max-width, а не width, чтобы сохранить пропорции.
        image.style.maxWidth = `${originalWidth * scaleFactor}px`;
        image.style.maxHeight = `${originalHeight * scaleFactor}px`;

        // Дополнительная логика для управления размером относительно родительского элемента
        // (опционально, в зависимости от требований макета)
        const parentWidth = parentElement.offsetWidth;
        const parentHeight = parentElement.offsetHeight;

        const scaledWidth = originalWidth * scaleFactor;
        const scaledHeight = originalHeight * scaleFactor;

        if (scaledWidth > parentWidth) {
            // Если масштабированное изображение шире родительского элемента,
            // уменьшаем его еще раз, чтобы поместилось.  Это может потребовать
            // изменить и высоту, чтобы сохранить пропорции.
            const widthScale = parentWidth / scaledWidth;
            image.style.maxWidth = `${parentWidth}px`;
            image.style.maxHeight = `${scaledHeight * widthScale}px`; // Пропорционально уменьшаем высоту
            console.log("Width adjusted to fit parent:", widthScale);
        }

        if (scaledHeight > parentHeight) {
            //Аналогично для высоты
            const heightScale = parentHeight / scaledHeight;
            image.style.maxHeight = `${parentHeight}px`;
            image.style.maxWidth = `${scaledWidth * heightScale}px`
            console.log("Height adjusted to fit parent:", heightScale);
        }


        console.log("Scaled Width:", image.offsetWidth);
        console.log("Scaled Height:", image.offsetHeight);

    };
}





async function renderThemeContent(contentContainer, themeTasks) {
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

            const image = document.createElement('img');
// image.src = task.image;
// image.alt = 'задание';
// image.classList.add('task-image');

// Вызываем функцию масштабирования
adjustImageSize(image, imgContainer); // Уменьшаем размер в 2 раза (коэффициент 0.5)

// image.onload = () => {
//     setTimeout(() => {
//         adjustImageSize(image, 0.10);
//     }, 0); // Задержка в 0 миллисекунд (просто для гарантии)
// };




            // const image = document.createElement('img');
            image.src = task.image;
            image.alt = 'задание';
            image.classList.add('task-image');

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
            
            imgContainer.appendChild(image);

            imgContainer.classList.add('imgContainer');
            listItem.appendChild(imgContainer);
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

document.addEventListener('DOMContentLoaded', async () => {
   await renderThemes();
});
