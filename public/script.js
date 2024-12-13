const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

// Load existing messages from localStorage
window.onload = () => {
  const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
  savedMessages.forEach((data) => {
    const item = document.createElement('li');
    item.textContent = `[${data.timestamp}] ${data.msg}`;
    messages.appendChild(item);
  });
};

// Save a message to localStorage
const saveMessage = (data) => {
  const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
  savedMessages.push(data);
  localStorage.setItem('chatMessages', JSON.stringify(savedMessages));
};

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

// Display incoming messages
socket.on('chat message', (data) => {
  const item = document.createElement('li');
  item.textContent = `[${data.timestamp}] ${data.msg}`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;

  // Save the message locally
  saveMessage(data);
});

// Notify users when someone joins or leaves
socket.on('user joined', (msg) => {
  const item = document.createElement('li');
  item.textContent = `🔵 ${msg}`;
  item.style.color = 'green';
  messages.appendChild(item);
});

socket.on('user left', (msg) => {
  const item = document.createElement('li');
  item.textContent = `🔴 ${msg}`;
  item.style.color = 'red';
  messages.appendChild(item);
});

// Clear messages when the user leaves the page
window.onbeforeunload = () => {
  localStorage.removeItem('chatMessages');
};
