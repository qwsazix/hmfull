import { int } from './int.js';
import { updateTags, request } from './functions.js';
import { baseUrl } from './api.js';

const creatingRequest = async () => {
  await int();

  let chosenApi = null, chosenCategory = null, chosenTag = null;

  const apis = document.querySelectorAll(`#apiName >div`);

  //обновляем выбранный API
  apis.forEach(apiBox => {
    apiBox.addEventListener('click', () => {
      for (let secondApiBox of apis) {
        secondApiBox.classList.remove('pressed');
      }
      apiBox.classList.add('pressed');
    });

    apiBox.addEventListener('change', (e) => {
      const categoryContainer = document.getElementById('category');
      categoryContainer.style.display = "flex";
      chosenApi = e.target.value;

      const chosenRadio = document.querySelector(`.active input[type="radio"]:checked`);
      if(chosenRadio) chosenRadio.checked = false;
      chosenTag = null; //обнуляем на всякий случай

      const blueTag = document.querySelector('#tags .pressed');
      if (blueTag) blueTag.classList.remove('pressed'); //удаляем эффект нажатия c прожатого тега в случае смены категорий

      updateTags(chosenApi,chosenCategory); //обновляем теги в зависимости от смененных API, category
    });
  });

  //обновляем выбранную категорию
  const categories = document.querySelectorAll(`#category >div`);
  categories.forEach(category => { 
    category.addEventListener('change', (e) => {
      chosenCategory = e.target.value;
      for (let catContainer of categories) {
        catContainer.classList.remove('pressed');
      }
      category.classList.add('pressed');


      const chosenRadio = document.querySelector(`.active input[type="radio"]:checked`);
      if (chosenRadio) chosenRadio.checked = false;
      chosenTag = null;

      const blueTag = document.querySelector('#tags .pressed');
      if (blueTag) blueTag.classList.remove('pressed'); //удаляем эффект нажатия c прожатого тега в случае смены категорий


      updateTags(chosenApi,chosenCategory); //обновляем теги в зависимости от смененных API, category
    });
  });


  //обновляем выбранный тег
  const tags = document.querySelectorAll('#tags .tag-container');
  tags.forEach(div => {
    div.addEventListener('change', (e) => {
      for (let secondDiv of tags) {
        secondDiv.classList.remove('pressed');
      }
      div.classList.add('pressed');
      chosenTag = e.target.value;
    });
  });

  
  //создаем юрл запрос к локальному серверу

  const imageContainer = document.getElementById('imgContainer');
  const clearButton = document.getElementById('clearImgs');
  submitBtn.addEventListener('click', async () => {
    if (!chosenApi || !chosenCategory || !chosenTag) {
      if (!chosenApi) {
        alert("Please select an API");
      } else if (!chosenCategory) {
        alert("Please select a category");
      } else {
        alert("Please select a tag");
      }
      return; // выход из функции, дальше код не идёт
    }

    const requestUrl = `${baseUrl}/${chosenApi}/${chosenCategory}/${chosenTag}`;
    const result = await request(requestUrl, imageContainer);

    const lightbox = document.querySelector('.lightbox');
    const images = imageContainer.querySelectorAll('img');
    images.forEach(image => {
      image.addEventListener('click', () => {
        lightbox.style.display = 'flex';
        lightbox.style.opacity = 1;
        document.body.classList.add('no-scroll');

        const lightboxImg = document.getElementById('lightboxImg');
        lightboxImg.src = image.src;
      });
    });

    if (!result) {
      alert("Failed to fetch image. Please try another API or try again later");
    } else {
      clearButton.style.display = 'inline-block';
    }
  });
}

creatingRequest();

const closeBtn = document.getElementById('closeBtn');
const lightbox = document.querySelector('.lightbox');

closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
  lightbox.style.opacity = 0;
  document.body.classList.remove('no-scroll');
});

const imageContainer = document.getElementById('imgContainer');
const clearButton = document.getElementById('clearImgs');
clearButton.addEventListener('click', () => {
    imageContainer.innerHTML = '';
    clearButton.style.display = 'none';
});

const downloadBtn = document.getElementById('downloadBtnContainer');
downloadBtn.addEventListener('click', () => {
  const link = document.createElement("a");
  const lightboxImg = document.getElementById('lightboxImg');
  link.href = lightboxImg.src;
  link.download = "image.png";
  link.click();
});

window.addEventListener("pageshow", () => {
  document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
});