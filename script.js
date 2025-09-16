const baseUrl = 'https://hmfullfetchserver.onrender.com';
const submitBtn = document.getElementById('submitBtn');


const fetchTags = async () => {
  const loading = document.getElementById('awaitingServer');
  const apiLabel = document.getElementById('apis');
  const errorLabel = document.getElementById('serverError');
  const statusText = document.getElementById('statusText');

  loading.style.display = 'block';

  const timeout = 10000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  //dots animation in status text
  let dots = 0;
  const dotsAnimation = setInterval(() => {
    dots = (dots + 1) % 4;
    statusText.textContent = "Server is loading" + '.'.repeat(dots);
  },500);

  try {
    const respond = await fetch(`${baseUrl}/tags`, {
      signal:controller.signal
    });

    clearTimeout(timer);

    if (!respond.ok) throw new Error('Server error');
    const data = await respond.json();
    myData = data;

    apiLabel.style.display = 'block';
    submitBtn.style.display = 'inline-block';
    return true;
  }
  catch (error) {
    console.error(error);
    errorLabel.style.display = 'block';
    return false;
  } finally {
    clearTimeout(timer);
    clearInterval(dotsAnimation);
    loading.style.display = 'none';
  }
  //Делаем запрос с нашего сервера, чтобы получить теги
}

//создаем выбор API, категории и тега, добавляем на сайт.
let myData = null;
const int = async () => {
  const success = await fetchTags();
  if (!success) return;

  Object.entries(myData).forEach(([api,categories]) => {
    const apiContainer = document.getElementById('apiName');
    const apiRadioContainer = document.createElement('div');
    apiRadioContainer.className = `apiRadioContainer`;
    apiRadioContainer.id = `${api}-radioContainer`;
    apiContainer.appendChild(apiRadioContainer);
    createRadio('api',api,apiRadioContainer); //добавляем на сайт радибоксы API, добавляем их в отдельный контейнер

    Object.entries(categories).forEach(([category, tags]) => {
        const tagsContainer = document.getElementById('tags');
        const containerForTags = document.createElement('div');
        containerForTags.className = (`${api}-${category}`);
        //создаем уникальный контейнер дял тегов, с понятным классом, 
        // чтобы хранить в нем теги, вставляем в tagsContainer.
        //Выходит что-то на подобии <div class="NekoBot-sfw">, 
        // внутри которого будут хранится все теги для этой категории.
        tagsContainer.appendChild(containerForTags);
      tags.forEach(tag => {
        const tagContainer = document.createElement('div');
        tagContainer.classList.add('tag-container',tag);
        containerForTags.appendChild(tagContainer);
        createRadio('tag', tag, tagContainer,`${api}-${category}`); //добавляем на сайт блоки с тегами
      })
    });
  });
};

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

    if (!result) {
      alert("Failed to fetch image. Please try another API or try again later");
    }
  });
}

creatingRequest();

// --------  вспомогательные функции  --------

const createRadio = (name,value,container,prefix = "") => { //функция, что добавляет радиобоксы
  const newRadio = document.createElement('input');
  newRadio.type = 'radio';
  newRadio.name = name;
  newRadio.value = value;
  newRadio.id = `${prefix}-${value}`;

  const labelForRadio = document.createElement('label');
  labelForRadio.htmlFor = newRadio.id;
  labelForRadio.textContent = value;

  container.appendChild(newRadio);
  container.appendChild(labelForRadio);
};

const updateTags = (chosenApi, chosenCategory) => { // функция, что обновляет теги и контейнеры тегов

  if (chosenApi && chosenCategory) {
  const tags = document.getElementById("tags");
  tags.style.display = "flex";

  const tagsDiv = document.querySelectorAll(`#tags >div`);
  tagsDiv.forEach(div => {
    div.style.display = "none";
    div.classList.remove('active');
  });
  const currentTagsDiv = document.querySelector(`.${chosenApi}-${chosenCategory}`);
  currentTagsDiv.style.display = "flex";
  currentTagsDiv.classList.add('active'); //добавляем класс active для ксс разметки
  };
}

const request = async (url,container) => { //делаем запрос к созданному юрл
  try {
    const respond = await fetch(url);
    if (!respond.ok) throw Error('Server error');
    const data = await respond.json();
    if (!data.url) {
      throw Error('Invalid response: no image URL');
    }
    const newImg = document.createElement('img');
    newImg.src = data.url;
    container.innerHTML = '';
    container.appendChild(newImg);
    return true;
  }
  catch (error) {
    console.error(error);
    return false;
  }
}
