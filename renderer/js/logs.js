document.getElementById("form_login").addEventListener("submit", function(event) {
    event.preventDefault();

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    // Perform login validation
    if (email === "jose@yahoo.com" && password === "pass") {
      var div_login = document.getElementById("div_login");
      var div_prompts = document.getElementById("div_prompts");

      div_login.classList.add("d-none");
      div_prompts.classList.remove("d-none");
      div_prompts.classList.add("d-flex");

      getPrompts();
    } else {
      alert("Invalid email or password. Please try again.");
    }
  });

  // Btn Logout
  var btn_logout = document.getElementById("btn_logout");
  if (btn_logout) {
    btn_logout.onclick = async function() {
      btn_logout.innerHTML = '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...';
      btn_logout.disabled = true;

      // Use Token to Logout
      var token = sessionStorage.getItem("token");
      var response = await window.axios.supaBase("post", "logout", null, token);
      //console.log(response);

      var div_login = document.getElementById("div_login");
      var div_prompts = document.getElementById("div_prompts");

      div_login.classList.remove("d-none");
      div_login.classList.add("d-flex");
      div_prompts.classList.remove("d-flex");
      div_prompts.classList.add("d-none");

      var field_email = document.querySelector("#form_login input[name='email']");
      var field_password = document.querySelector("#form_login input[name='password']");
      field_email.value = "";
      field_email.classList.remove("is-invalid");
      field_password.value = "";
      field_password.classList.remove("is-invalid");
      btn_logout.innerHTML = "Logout";
      btn_logout.disabled = false;
    };
  }

  // Btn Clear History
var btn_clear_history = document.getElementById("btn_clear_history");
  if (btn_clear_history) {
    btn_clear_history.onclick = async function() {
      var confirmation = confirm("Are you sure you want to clear the history? This action cannot be undone.");
        if (confirmation) {
          
          await clearHistory();
        }
    };
  }
  
  async function clearHistory() {
    try {
      // Make an API call to delete all rows in the table
      const { error } = await window.axios.supaBase('delete');
  
      if (error) {
        throw error;
      }
  
      // Success message
      alertMessage("success", "All rows deleted successfully!");
  
      // Remove all rows from the table
      const tbody = document.getElementById('tbl_prompts');
      tbody.innerHTML = '';
  
    } catch (error) {
      alertMessage("error", "Failed to delete all rows: " + error);
      // Display error message or perform any other desired action
    }
  }
  

async function getPrompts() {
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
  
  // Set Btn Delete Prompt Click functionality from Table Prompts
  const tbl_prompts = document.getElementById('tbl_prompts');
  if (tbl_prompts) {
    tbl_prompts.onclick = async function (e) {
      if(e.target && e.target.id == "btn_prompts_del") {
        const id = e.target.name;
        const response = await window.axios.supaBase('delete', '*');
        //console.log(response);
        
        alertMessages("success", "Successfully deleted ID " + '*' + '!');
        getPrompts();
      }
    };
  }
