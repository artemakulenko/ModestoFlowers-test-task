'use strict'

const form = document.querySelector('form');
const steps = Array.from(form.querySelectorAll('.step'));
const nextBtn = form.querySelector('.next-btn');
const prevBtn = form.querySelector('.previous-btn');

const username = form.querySelector('#username');
const company = form.querySelector('#company-name');
const email = form.querySelector('#email');
const phone = form.querySelector('#phone');
const promocode = form.querySelector('#promocode');

const capcha = form.querySelector('.capcha')
const capchaInput = form.querySelector('#capchaInput')
const password = form.querySelector('#password')
const password2 = form.querySelector('#password2')
const policy = form.querySelector('#policy')
const statsMsg = document.querySelector('.stats')
const disableDragList = document.querySelectorAll('img.disable-drag')
const statsBtn = document.querySelector('.stats__remove')







// Onload Events 🔽

// Disable drag behavior for .disable-drag images
disableDragList.forEach(item => item.ondragstart = () => false )

// Generate and display capcha
function getRandomCapcha(symbols) {
  const alphabet = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
  let word = '';
  for(let i = 0; i < symbols; i++){
    word += alphabet[Math.round(Math.random() * (alphabet.length - 1))].toUpperCase();
    const html = `<div class='capcha__letter'>${word[i]}</div>`;
    capcha.insertAdjacentHTML('beforeend', html)  
  }
  return word;
}
const getCapcha = getRandomCapcha(5)












// Functions 🔽

// Display input error in form group
const setError = (element, message) => {
  const formGroup = element.parentElement;
  const errorDisplay = formGroup.querySelector('.form__error')

  errorDisplay.textContent = message

  formGroup.classList.add('error')
  formGroup.classList.remove('succes')
  formGroup.classList.remove('shake-horizontal')
  formGroup.offsetWidth
  formGroup.classList.add('shake-horizontal')
}




// Apply input success in form group
const setSuccess = element => {
  const formGroup = element.parentElement;
  const errorDisplay = formGroup.querySelector('.form__error')

  errorDisplay.textContent = ''
  formGroup.classList.remove('error')
  formGroup.classList.add('success')
  formGroup.classList.remove('shake-horizontal')
}



// Regexp to check if email valid
const isValidEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}





// Validation for first screen
const validateFirstStepInputs = () => {
  const usernameValue = username.value.trim()
  const companyValue = company.value.trim()
  const emailValue = email.value.trim()
  const phoneValue = phone.value.trim()
  let valid = false  
  
  usernameValue == '' ? setError(username, 'Заполните имя') : setSuccess(username)

  companyValue == '' ? setError(company, 'Заполните название компании') : setSuccess(company)

  if (emailValue === '') setError(email, 'Заполните email')
  else if(!isValidEmail(emailValue)) setError(email, 'Введите валидный email')
  else setSuccess(email)
  

  if(phoneValue === '') setError(phone, 'Введите телефон')
  else if(phoneValue.length < 18) setError(phone, 'Дополните телефон')
  else setSuccess(phone)
    
  const getAllInvalids = Array.from( form.querySelectorAll('.form__group.error') ).length
  getAllInvalids == 0 ? valid = true : valid = false

  return valid
}







// Validation for second screen
const secondStepValidate = () => {
  const capchaValue = capchaInput.value.trim().toUpperCase()
  const passwordValue = password.value.trim()
  const password2Value = password2.value.trim()
  const isPolicyChecked = policy.checked
  let valid = false 

  
  if(passwordValue == '') 
    setError(password, 'придумайте пароль')
  else if(passwordValue.length < 8) 
    setError(password, 'пароль должен состоять из не менее чем 8 символов')
  else setSuccess(password)

  if(password2Value == '')
    setError(password2, 'подтвердите пароль')
  else if(passwordValue != password2Value)
    setError(password2, 'пароли не совпадают')
  else setSuccess(password2)
  

  capchaValue !== getCapcha ? setError(capchaInput, 'капча не совпадает') : setSuccess(capchaInput)

  !isPolicyChecked ? setError(policy, 'Согласитесь с условиями') : setSuccess(policy)


  const getAllInvalids = Array.from( form.querySelectorAll('.form__group.error') ).length
  getAllInvalids == 0 ? valid = true : valid = false

  return valid
}



// Switch steps
function changeStep(btn) {
  const active = form.querySelector('.active');
  let index = steps.indexOf(active);
  steps[index].classList.remove('active');
  btn === 'next' ? index++ : index--
  steps[index].classList.add('active');
}

















// Click Events 🔽


// Next step and validate first input groups 
nextBtn.addEventListener('click', () => {
  return validateFirstStepInputs() ? changeStep('next') : false
});


// Prev step 
prevBtn.addEventListener('click', () => {
  changeStep('prev');
});





// Final Submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if(secondStepValidate()){
    const inputs = [];
    form.querySelectorAll('input.to-stats').forEach((input) => {
      const { name, value } = input;
      inputs.push({ name, value });
    });
    
    statsMsg.classList.remove('stats__disable')
    console.table(inputs);
    form.reset();
  } else return false
});



// Remove Stats message after success submit
statsBtn.addEventListener('click', function(){
  const stats = this.parentElement
  stats.classList.add('stats__disable')
})












// Mask for phone input
const mask = (selector) => {

  function createMask(event) {
    const matrix = ' (___)-___ __ __';
    const def = '+7';
    let keyPressed = '';

    const isSmthInInput = this.value.length > def.length;

    if (event.type === 'blur' && !isSmthInInput) {
      this.value = '';
      return;
    } else if (event.type === 'input') {
      keyPressed = event.data;
    }

    let val = isSmthInInput
      ? this.value.slice(0, def.length) === def
        ? this.value.slice(def.length).replace(/\D/g, '')
        : (keyPressed + this.value.slice(def.length + 1)).replace(/\D/g, '')
      : '';

    let i = 0;

    this.value =
      def +
      matrix.replace(/./g, function (a) {
        return /[_\d]/.test(a) && i < val.length
          ? val.charAt(i++)
          : i >= val.length
          ? ''
          : a;
      });
  }

  selector.addEventListener('input', createMask);
  selector.addEventListener('focus', createMask);
  selector.addEventListener('blur', createMask);
};

mask(phone);
