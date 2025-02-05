
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

        const content = document.createElement('div');
        content.classList.add('content');
        themeContainer.appendChild(content);

         for (const subtheme in groupedTasks[theme]) {
            const subthemeList = document.createElement('ul');
             subthemeList.classList.add('subtheme-list');
             const subthemeTitle = document.createElement('h3');
                subthemeTitle.textContent = subtheme;
                content.appendChild(subthemeTitle);
                content.appendChild(subthemeList);

            groupedTasks[theme][subtheme].forEach((task, index) => {

                const listItem = document.createElement('li');
                 listItem.classList.add('task-item');

                 const taskNumber = document.createElement('span');
                    taskNumber.textContent = `${index + 1}. `;
                    taskNumber.classList.add('task-number');
                     listItem.appendChild(taskNumber);

                const image = document.createElement('img');
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
                  answerButton.addEventListener('click', () => checkAnswer(input, task.correctAnswer, listItem));

                const decisionButton = document.createElement('button');
                decisionButton.textContent = 'Показать решение';
                decisionButton.classList.add('decision-button');
                decisionButton.addEventListener('click', () => showDecision(task.decision, listItem));
                 decisionButton.style.display = 'none';

                listItem.appendChild(image);
                listItem.appendChild(input);
                listItem.appendChild(answerButton);
                 listItem.appendChild(decisionButton);


                subthemeList.appendChild(listItem);
            });
        }
    }

    const collapsibles = document.querySelectorAll('.collapsible');
    collapsibles.forEach(collapsible => {
        collapsible.addEventListener('click', function() {
            // Сворачиваем все остальные темы
            collapsibles.forEach(otherCollapsible => {
                if (otherCollapsible !== this) {
                    otherCollapsible.classList.remove('active');
                    const content = otherCollapsible.querySelector('.content');
                    content.style.display = 'none';
                }
            });

            // Разворачиваем или сворачиваем текущую тему
            this.classList.toggle('active');
            const content = this.querySelector('.content');
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
    });

    // Скрываем все content изначально
    const allContent = document.querySelectorAll('.content');
    allContent.forEach(content => {
        content.style.display = 'none';
    });
}

async function loadQuizData() {
    const response = await fetch('quizData.json');
    const data = await response.json();
    return data;
}

document.addEventListener('DOMContentLoaded', async () => {
   await renderThemes();
});
