const form = document.getElementById("bot_message");
if (form) {
  form.onsubmit = async function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    let message = formData.get("message");
    if (message.length <= 5){
      alertMessages( "error", "Please input atleast five characters!")
      return;
    }

    //console.log(formData.get("message"));
    const response = await window.axios.openAI(formData.get("message")); 
    document.getElementById("message_response").innerHTML = JSON.stringify(response.choices[0].text).replace(/\\n/g, '');

    const db_response = await window.axios.supaBase('post', 'prompts', {
      message: message,
      response: response.choices[0].text
    });

    const text = db_response.choices[0].text.trim();
    console.log(text);

  }
};

function alertMessages(status, message){
  window.Toastify.showToast({
    text: message,
    duration: 3000,
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      textAlign: "center",
      background: status == "error" ? "red":"green", 
      color: "white",
      padding: "5px",
      marginTop: "2px"
    }
  });
}