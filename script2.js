
const semesterVariantsContainer = document.getElementById('semester-variants');
const generateButtons = document.querySelectorAll('.generate-button');
const submitSemesterButton = document.getElementById('submit-semester-button');
const totalScoreDisplay = document.getElementById('total-score');

let currentVariantTasks = [];

async function loadQuizData() {
  const response = await fetch('quizData.json');
  const data = await response.json();
  return data;
}

function checkAnswer(inputElement, correctAnswer, listItem) {
    const userAnswer = inputElement.value.trim().toLowerCase();
    let resultMessage = listItem.querySelector('.result-message');
    if (!resultMessage) {
        resultMessage = document.createElement('p');
        resultMessage.classList.add('result-message');
        listItem.appendChild(resultMessage);
    }
    const decisionButton = listItem.querySelector('.decision-button');
    decisionButton.style.display = 'inline-block'; // Показываем кнопку решения всегда!

    if (userAnswer === '') {
        resultMessage.textContent = `Вы не ввели ответ. Правильный ответ: ${correctAnswer}`;
        resultMessage.classList.remove('correct');
        resultMessage.classList.add('incorrect');
    } else if (userAnswer === correctAnswer) {
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

async function generateSemesterVariant(variantNumber) {
  const quizData = await loadQuizData();
  currentVariantTasks = [];
  semesterVariantsContainer.innerHTML = '';
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
  const variantContainer = document.createElement('div')
  variantContainer.classList.add('variant-container');
  const variantTitle = document.createElement('h2');
  variantTitle.textContent = `Вариант ${variantNumber}`;
  variantContainer.appendChild(variantTitle)
  semesterVariantsContainer.appendChild(variantContainer)
  let taskNumberInVariant = 1;
  for (const theme in groupedTasks) {

      for (const subtheme in groupedTasks[theme]) {
          const subthemeList = document.createElement('ul');
          subthemeList.classList.add('subtheme-list');
           const subthemeTitle = document.createElement('h4');
           const taskNumber = document.createElement('span');
            taskNumber.textContent = `${taskNumberInVariant}. `;
            taskNumber.classList.add('subtheme-number');
            subthemeTitle.appendChild(taskNumber);
           subthemeTitle.append(subtheme);


          variantContainer.appendChild(subthemeTitle);
          variantContainer.appendChild(subthemeList);
          const tasksForSubtheme = groupedTasks[theme][subtheme];
          const taskForVariant = tasksForSubtheme.find(task => task.number == variantNumber);
          let listItem = document.createElement('li');
          listItem.classList.add('task-item');
          if (taskForVariant) {
              currentVariantTasks.push(taskForVariant);
              const image = document.createElement('img');
              image.src = taskForVariant.image;
              image.alt = 'задание';
              image.classList.add('task-image');
              const input = document.createElement('input');
              input.type = 'text';
              input.placeholder = 'Введите ответ';
              input.classList.add('answer-input');

              const decisionButton = document.createElement('button');
              decisionButton.textContent = 'Показать решение';
              decisionButton.classList.add('decision-button');
              decisionButton.style.display = 'none';  //Скрыть кнопку изначально

              decisionButton.addEventListener('click', () => showDecision(taskForVariant.decision, listItem));


              listItem.appendChild(image);
              listItem.appendChild(input);
              listItem.appendChild(decisionButton);
          } else {
               listItem.textContent = 'Задание для данного варианта не найдено';
          }
            subthemeList.appendChild(listItem);
           taskNumberInVariant++;
      }
  }
  submitSemesterButton.style.display = 'inline-block';
  totalScoreDisplay.style.display = 'none';
}

function calculateScore() {
    let correctAnswersCount = 0;
    const taskItems = semesterVariantsContainer.querySelectorAll('.task-item');
    taskItems.forEach((listItem, index) => {
      const input = listItem.querySelector('.answer-input');
         const task = currentVariantTasks[index];
        if (task && input) {
           checkAnswer(input, task.correctAnswer, listItem);
           const userAnswer = input.value.trim().toLowerCase();
           if (userAnswer === task.correctAnswer) {
               correctAnswersCount++;
            }
        }
    });

     totalScoreDisplay.textContent = `Вы ответили правильно на ${correctAnswersCount} из ${currentVariantTasks.length} заданий.`;
    totalScoreDisplay.style.display = 'block';
}


generateButtons.forEach(button => {
    button.addEventListener('click', function () {
        const variantNumber = this.dataset.variant;
        generateSemesterVariant(variantNumber);

    });
});

submitSemesterButton.addEventListener('click', calculateScore);
