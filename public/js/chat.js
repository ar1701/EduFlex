function sendMessage() {
    var messageInput = document.getElementById('messageInput');
    var message = messageInput.value.trim();
    if (message === '') {
        alert("Please enter a message.");
        return;
    }

   
    displayMessage('You', message);

    
    messageInput.value = '';
}

function displayMessage(sender, message) {
    var chatArea = document.getElementById('chatArea');
    var messageDiv = document.createElement('div');
    messageDiv.innerHTML = '<strong>' + sender + ':</strong> ' + message;
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}
