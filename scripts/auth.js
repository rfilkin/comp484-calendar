//sign up
const signupForm = document.querySelector("#signupForm");
signupForm.addEventListener('submit', (e) =>{
  e.preventDefault();
  
  //get user info
  const email = signupForm['email'].value;
  const password = signupForm['password'].value;
  
  console.log(email, password);
  
  auth.createUserWithEmailAndPassword();
});