// Form Login
document.getElementById("form_login").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    
    var email = document.getElementsByName("email")[0].value;
    var password = document.getElementsByName("password")[0].value;
    
    // Perform login validation
    if (email === "jose" && password === "pass") {
      // Login successful
      // Redirect the user to the application logs page or perform any other desired action
      window.location.href = "app_logs.html";
    } else {
      // Login failed
      // Display an error message or perform any other desired action
      alert("Invalid email or password. Please try again.");
    }
  });
  async function getPrompts () {
    // Fetch API Response
    const response = await window.axios.supaBase('get');

    // Load table from API Response
    let htmlResult = '';
    Object.keys(response).forEach(key => {
        let date = new Date(response[key].created_at.replace(' ', 'T'));

        htmlResult += '<tr>' +
            '<th scope="row">' +  response[key].prompt_id + '</th>' +
            '<td>' + response[key].user_message + '</td>' +
            '<td>' + response[key].bot_response + '</td>' +
            '<td>' + date.toLocaleString('en-US', { timeZone: 'UTC' }) + '</td>' +
            '<td>' + 
                '<div class="btn-group" role="group">' +
                    '<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">' +
                        'Action' +
                    '</button>' +
                    '<ul class="dropdown-menu">' +
                        '<li><a id="btn_prompts_del" class="dropdown-item" href="#" name="' + response[key].prompt_id + '">Remove</a></li>' +
                    '</ul>' +
                '</div>' +
        '</tr>';
    });

    const tbody = document.getElementById('tbl_prompts');
    tbody.innerHTML = htmlResult;
}
        