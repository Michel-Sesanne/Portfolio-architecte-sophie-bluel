const formulaireLogIn = document.querySelector("form");

formulaireLogIn.addEventListener("submit", (e) => {
  e.preventDefault();

  const logIn = {
    email: e.target.querySelector("#email").value,
    password: e.target.querySelector("#password").value,
  };
  const chargeUtile = JSON.stringify(logIn);

  fetch("http://localhost:5678/api/users/logIn", {
    method: "POST",
    headers: { "Content-Type": "application/json" }, 
    body: chargeUtile
  })
  .then(async (response) => {
    if (response.ok) {
      const data = await response.json();
      const userToken = data.token;
      window.localStorage.setItem("token", userToken);
      
      window.location.href = "index.html";
    }else{
      const erreurLogin = document.querySelector(".login-error");
      erreurLogin.innerText= "Erreur dans l’identifiant ou le mot de passe";
    }
  })
  .catch(error => {
    alert(error);
  });
});
