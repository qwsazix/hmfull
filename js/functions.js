export const createRadio = (name,value,container,prefix = "") => { //функция, что добавляет радиобоксы
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

export const updateTags = (chosenApi, chosenCategory) => { // функция, что обновляет теги и контейнеры тегов

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

export const request = async (url,container) => { //делаем запрос к созданному юрл
  try {
    const respond = await fetch(url);
    if (!respond.ok) throw Error('Server error');
    const data = await respond.json();
    if (!data.url) {
      throw Error('Invalid response: no image URL');
    }
    const newImg = document.createElement('img');
    newImg.src = data.url;
    newImg.draggable = false;
    container.appendChild(newImg);
    return true;
  }
  catch (error) {
    console.error(error);
    return false;
  }
}