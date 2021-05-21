$(document).ready(()=>{


const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

  //Get username and room from URL
  const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
  });

const socket = io();

  //Join Chat room
  socket.emit('joinRoom', { username, room });

  //Get room in users
  socket.on('roomUsers', (data) => {
    outputRoomName(data.room);
    outputUsers(data.users);  
  });

  //Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

  //Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;

});

//Message submit 
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  //get message text
  const msg = e.target.elements.msg.value;

  //Emit message to server
  socket.emit('chatMessage', msg);

  //Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

//typing
var timeout;
var typing = false;

function timeoutFunction() {
  typing = false;
  socket.emit('typing',false);
}
$('#msg').keyup(function() {
  typing = true;
  socket.emit("typing", username + ' is typing.....');
    clearTimeout(timeout);
    timeout = setTimeout (timeoutFunction, 1000);
});

socket.on('typing', function(data) {
  if(data) {
    $('.typing').html(data);
  }else{
    $('.typing').html("");
  }
})

//Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
  ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

//add room name to DOM

function outputRoomName(room) {
  roomName.innerText = room;
}

//add users to DOM 

function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
  }
})