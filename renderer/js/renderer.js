// Btn Continue
const btn_continue = document.getElementById("btn_continue");
if (btn_continue) {
  btn_continue.onclick = function (e) {
    // Hide Intro Area and Show ChatBox
    const intro_area = document.getElementById("intro-area");
    const chat_area = document.getElementById("chat-area");
    intro_area.classList.add('d-none');
    chat_area.classList.remove('d-none');
    chat_area.classList.add('d-flex');
    // Show Latest Chat
    const div_conversation = document.getElementById('div-conversation');
    div_conversation.scrollTo(0, div_conversation.scrollHeight);
    // Focus Input Type Message
    const txt_message = document.getElementById('txt_message');
    txt_message.focus();
  }
}

function alertMessages(status, message) {
  window.Toastify.showToast({
    text: message,
    duration: 3000,
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      textAlign: "center",
      background: status == "error" ? "red" : "green",
      color: "white",
      padding: "5px",
      marginTop: "2px",
    },
  });
}