const quizData = [
    {
        theme: 'Разложение многочленов на множители. Формулы сокращенного умножения.',
        subtheme: 'Найдите значение числового выражения',
        number: 1,
        image: 'images/1-1-1.png',
        correctAnswer: '1',
        decision: 'images/a-1-1-1.png'
    },
    {
        theme: 'Разложение многочленов на множители. Формулы сокращенного умножения.',
        subtheme: 'Найдите значение числового выражения',
        number: 2,
        image: 'images/1-1-2.png',
        correctAnswer: '1',
        decision: 'images/a-1-1-1.png'
    },
    {
        theme: 'Разложение многочленов на множители. Формулы сокращенного умножения.',
        subtheme: 'Найдите значение числового выражения',
        number: 3,
        image: 'images/1-1-3.png',
        correctAnswer: '1',
        decision: 'images/a-1-1-1.png'
    },
    {
        theme: 'Разложение многочленов на множители. Формулы сокращенного умножения.',
        subtheme: 'Найдите значение числового выражения',
        number: 4,
        image: 'images/1-1-4.png',
        correctAnswer: '1',
        decision: 'images/a-1-1-1.png'
    },
    {
        theme: 'Функции и их графики',
        subtheme: 'Найдите значение числового выражения',
        number: 'Вычисление значений функции по формуле',
        image: 'images/2-1-1.png',
        correctAnswer: '1',
        decision: 'images/a-1-1-1.png'
    },
        {
        theme: 'Функции и их графики',
        subtheme: 'Вычисление значений функции по формуле',
        number: 2,
        image: 'images/2-1-2.png',
        correctAnswer: '1',
        decision: 'images/a-1-1-1.png'
    },
     {
        theme: 'Функции и их графики',
        subtheme: 'Вычисление значений функции по формуле',
        number: 3,
        image: 'images/2-1-3.png',
        correctAnswer: '1',
        decision: 'images/a-1-1-1.png'
    }
];

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

    if (userAnswer === correctAnswer) {
        resultMessage.textContent = 'Правильно!';
        resultMessage.classList.remove('incorrect');
        resultMessage.classList.add('correct');
        decisionButton.style.display = 'inline-block';
    } else {
        resultMessage.textContent = `Неверно. Правильный ответ: ${correctAnswer}`;
        resultMessage.classList.remove('correct');
        resultMessage.classList.add('incorrect');
         decisionButton.style.display = 'none';
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
function renderTasks() {
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
        const themeTitle = document.createElement('h2');
        themeTitle.textContent = theme;
        themeContainer.appendChild(themeTitle);
        tasksContainer.appendChild(themeContainer);
        for (const subtheme in groupedTasks[theme]) {
            const subthemeList = document.createElement('ul');
             subthemeList.classList.add('subtheme-list');
             const subthemeTitle = document.createElement('h3');
                subthemeTitle.textContent = subtheme;
                themeContainer.appendChild(subthemeTitle);
                themeContainer.appendChild(subthemeList);
            groupedTasks[theme][subtheme].forEach(task => {

                const listItem = document.createElement('li');
                 listItem.classList.add('task-item');

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


                listItem.appendChild(image);
                listItem.appendChild(input);
                listItem.appendChild(answerButton);
                 listItem.appendChild(decisionButton);


                subthemeList.appendChild(listItem);
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', renderTasks);
