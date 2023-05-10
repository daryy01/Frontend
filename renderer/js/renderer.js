const form = document.getElementById("bot_message");
if (form) {
  form.onsubmit = async function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    console.log(formData.get("message"));

    const response = await window.axios.openAI(formData.get("message"));
    document.getElementById("message_response").innerHTML = JSON.stringify(response.choices[0].text).replace(/\\n/g, '');
  };
}
 