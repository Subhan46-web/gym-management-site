const openLoginBtn = document.getElementById('open-login-btn');
const loginPopup = document.getElementById('login-popup');
const closeBtn = document.querySelector('.close-btn');

openLoginBtn.addEventListener('click', () => {
  loginPopup.style.display = 'flex'; 
});

closeBtn.addEventListener('click', () => {
  loginPopup.style.display = 'none'; 
});

window.addEventListener('click', (event) => {
  if (event.target === loginPopup) {
    loginPopup.style.display = 'none'; 
  }
});


const openSignBtn = document.getElementById('signup-btn');
const SignupPopup = document.getElementById('signup-popup');
const close2Btn = document.querySelector('.close-btn2');

openSignBtn.addEventListener('click', () => {
    SignupPopup.style.display = 'flex'; 
});

close2Btn.addEventListener('click', () => {
    SignupPopup.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === SignupPopup) {
    SignupPopup.style.display = 'none'; 
  }
});


const openJoinBtn = document.getElementById('join-btn');
const joinPopup = document.getElementById('join-popup');
const close3Btn = document.querySelector('.close-btn3');

function showPopup() {
    joinPopup.style.display = 'flex';
  }
  
  function hidePopup() {
    joinPopup.style.display = 'none';
  }
  
  openJoinBtn.addEventListener('click', showPopup);

  close3Btn.addEventListener('click', hidePopup);
  
  window.addEventListener('click', (event) => {
    if (event.target === joinPopup) {
      hidePopup();
    }
  });