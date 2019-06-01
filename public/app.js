const messages = document.querySelector('.messages');

const createMessageElement = message => {
  const el = document.createElement('div');
  el.classList.add('message');

  const fromEl = document.createElement('span');
  fromEl.innerText = message.from;

  const dateEl = document.createElement('time');
  const date = new Date(message.date);
  dateEl.setAttribute('datetime', date.toISOString());
  dateEl.innerText = date.toLocaleString();

  const textEl = document.createElement('p');
  textEl.innerText = message.text;

  el.append(dateEl, fromEl, textEl);
  window.scroll(0, document.body.offsetHeight);
  return el;
};

const getFirstMessages = async () => {
  const req = await fetch('/messages');
  const data = await req.json();
  const messageElements = data.map(message => createMessageElement(message));
  messages.append(...messageElements);

  return true;
};

document.addEventListener('DOMContentLoaded', async () => {
  await getFirstMessages();

  const socket = new WebSocket('ws://localhost:8080/push');
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    messages.append(createMessageElement(message));
  };
});
