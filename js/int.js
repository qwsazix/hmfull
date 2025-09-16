import { fetchTags, myData } from './api.js';
import { createRadio } from './functions.js';


export const int = async () => {
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