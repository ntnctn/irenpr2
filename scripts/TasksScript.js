
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

        let targetFontSizePixels;
        // Определяем целевой размер шрифта в зависимости от ширины экрана
        if (window.innerWidth <= 768) { // Примерное значение для телефонов
            targetFontSizePixels = 7;
        } else { // Для ноутбуков и других устройств
            targetFontSizePixels = 9;
        }

        const fontSizeScaleFactor = targetFontSizePixels / originalFontSizePixels;
        const scaleFactor = fontSizeScaleFactor;

        const parentWidth = parentElement.offsetWidth;
        const parentHeight = parentElement.offsetHeight;

        const parentWidthVW = (parentWidth / window.innerWidth) * 100;
        const parentHeightVW = (parentHeight / window.innerHeight) * 100;

        let scaledWidthVW;
        let scaledHeightVW;

        // Если телефон и картинка большая
        if (window.innerWidth <= 768 && originalWidth >= 1500) {
            scaledWidthVW = 90;  //Фиксированная ширина
            const aspectRatio = originalHeight / originalWidth; // пропорция сторон
            scaledHeightVW = 90 * aspectRatio; // Вычисляем высоту по пропорции
            console.log("Большая картинка на телефоне")

        } else {
            // Для всех остальных случаев применяем масштабирование
            const maxWidthScale = parentWidthVW / ((originalWidth / window.innerWidth) * 100);
            const maxHeightScale = parentHeightVW / ((originalHeight / window.innerHeight) * 100);
            const finalScaleFactor = Math.min(scaleFactor, maxWidthScale, maxHeightScale);

            scaledWidthVW = (originalWidth * finalScaleFactor / window.innerWidth) * 100;
            scaledHeightVW = (originalHeight * finalScaleFactor / window.innerHeight) * 100;
            console.log("Маленькая картинка на телефоне / Любая на десктопе")
        }


        image.style.maxWidth = `${scaledWidthVW}vw`;
        image.style.maxHeight = `${scaledHeightVW}vw`;


        console.log("Original Width:", originalWidth);
        console.log("Original Height:", originalHeight);
        console.log("Target Font Size:", targetFontSizePixels);
        console.log("Font Size Scale Factor:", fontSizeScaleFactor);
        console.log("Parent Width (px):", parentWidth);
        console.log("Parent Height (px):", parentHeight);
        console.log("Parent Width (vw):", parentWidthVW);
        console.log("Parent Height (vw):", parentHeightVW);
        // console.log("Max Width Scale:", maxWidthScale);
        // console.log("Max Height Scale:", maxHeightScale);
        // console.log("Final Scale Factor:", finalScaleFactor);
        console.log("image.offsetWidth", image.offsetWidth)
        console.log("image.offsetHeight", image.offsetHeight)
        console.log("image.style.maxWidth (vw):", image.style.maxWidth)
        console.log("image.style.maxHeight (vw):", image.style.maxHeight)

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
