export const baseUrl = 'https://hmfullfetchserver.onrender.com';

export let myData = null;

export const fetchTags = async () => {
  const loading = document.getElementById('awaitingServer');
  const apiLabel = document.getElementById('apis');
  const errorLabel = document.getElementById('serverError');
  const statusText = document.getElementById('statusText');
  const submitBtn = document.getElementById('submitBtn');

  loading.style.display = 'block';

  const timeout = 60000;
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
}