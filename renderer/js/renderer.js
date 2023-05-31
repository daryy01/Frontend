const form = document.getElementById("bot_message");

if (form) {
  form.onsubmit = async function (e) {
    e.preventDefault();//prevent the default form submission

    const formData = new FormData(form);//creates new FormData object using form//easy access of forms input values
    
    //the input message is retrived from the form using formData.get("message");
    let message = formData.get("message");
    //checks if our message greater or equal to 5
    if (message.length <= 5){
      alertMessages( "error", "Input atleast a minimun of five characters!")
      return;
    }

    //console.log(formData.get("message"));
    //This function is responsible for making the API request to OpenAI and returning the response
    const response = await window.axios.openAI(formData.get("message")); 
    document.getElementById("message_response").innerHTML = JSON.stringify(response.choices[0].text).replace(/\\n/g, '');
    
    //Store to database the prompt and result
const db_response = await window.axios.supaBase('post', '', {
    message: message,
    response: response
    });
    //console.log(db_response);
  }
};

//responsible for displaying toast messages
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
 
// Get the elements
document.getElementById("btn_continue").addEventListener("click", function() {
  document.getElementById("intro-area").style.display = "none";
  document.getElementById("chat-area").style.display = "block";
});

