document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('myForm');
  const steps = document.querySelectorAll('main');
  const nextButtons = document.querySelectorAll('button[type="submit"]');
  const backButtons = document.querySelectorAll('.go-back');
  const changeLink = document.getElementById('change-link');
  const circles = document.querySelectorAll('.circle');
  let currentStep = 0;


  showStep(currentStep);


  nextButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      if (validateStep(currentStep)) {
        saveData(currentStep);
        if (currentStep < steps.length - 1) {
          showStep(currentStep + 1);
          if (currentStep + 1 === steps.length - 1) {
            displaySummary();
          }
        } else {
        
          showStep(currentStep + 1);
        }
      }
    });
  });


  backButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      showStep(currentStep - 1);
    });
  });


  changeLink.addEventListener('click', function(event) {
    event.preventDefault();
    showStep(1); 
  });

 
  function showStep(step) {
    steps.forEach((stepElement, index) => {
      if (index === step) {
        stepElement.style.display = 'flex';
      } else {
        stepElement.style.display = 'none';
      }
    });
    updateActiveCircle(step);
    currentStep = step;
  }

 
  function updateActiveCircle(step) {
    circles.forEach((circle, index) => {
      if (index === step) {
        circle.classList.add('active');
      } else {
        circle.classList.remove('active');
      }
    });
  }


  function validateStep(step) {
    clearErrors();
    let hasErrors = false;

    if (step === 0) {
      const nameInput = document.getElementById('name');
      const nameError = document.getElementById('name-error');
      if (nameInput.value.trim() === '') {
        nameError.textContent = 'This field is required';
        nameInput.classList.add('error-border');
        hasErrors = true;
      }

      const emailInput = document.getElementById('email');
      const emailError = document.getElementById('email-error');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput.value.trim() === '') {
        emailError.textContent = 'This field is required';
        emailInput.classList.add('error-border');
        hasErrors = true;
      } else if (!emailPattern.test(emailInput.value.trim())) {
        emailError.textContent = 'Invalid email format';
        emailInput.classList.add('error-border');
        hasErrors = true;
      }

      const phoneInput = document.getElementById('phone');
      const phoneError = document.getElementById('phone-error');
      const phonePattern = /^\+?[0-9\s\-]{7,15}$/;
      if (phoneInput.value.trim() === '') {
        phoneError.textContent = 'This field is required';
        phoneInput.classList.add('error-border');
        hasErrors = true;
      } else if (!phonePattern.test(phoneInput.value.trim())) {
        phoneError.textContent = 'Invalid phone number format';
        phoneInput.classList.add('error-border');
        hasErrors = true;
      }
    } else if (step === 1) {
      const selectedPlan = document.querySelector('.plan.active');
      const planError = document.getElementById('plan-error');
      if (!selectedPlan) {
        planError.textContent = 'You must select one option';
        hasErrors = true;
      }
    }

    return !hasErrors;
  }


  function clearErrors() {
    const errors = document.querySelectorAll('.error');
    errors.forEach(error => error.textContent = '');

    const inputs = document.querySelectorAll('.input-group input');
    inputs.forEach(input => input.classList.remove('error-border'));

    const planError = document.getElementById('plan-error');
    if (planError) {
      planError.textContent = '';
    }
  }

 
  function saveData(step) {
    if (step === 0) {
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      localStorage.setItem('name', name);
      localStorage.setItem('email', email);
      localStorage.setItem('phone', phone);
    } else if (step === 1) {
      saveBillingPeriod();
      saveSelectedPlan();
    } else if (step === 2) {
      saveAddons();
    }
  }

 
  function saveBillingPeriod() {
    const billingPeriod = document.getElementById('billing-toggle').checked ? 'yearly' : 'monthly';
    localStorage.setItem('billingPeriod', billingPeriod);
  }

 
  function saveSelectedPlan() {
    const selectedPlan = document.querySelector('.plan.active');
    const planName = selectedPlan.querySelector('h2').innerText;
    const planPrice = selectedPlan.querySelector('.price').innerText;
    localStorage.setItem('planName', planName);
    localStorage.setItem('planPrice', planPrice);
  }


  function saveAddons() {
    const addons = document.querySelectorAll('.addon-checkbox');
    const selectedAddons = [];
    addons.forEach(addon => {
      if (addon.checked) {
        const addonTitle = addon.nextElementSibling.querySelector('.addon-title').innerText;
        const addonPrice = addon.closest('.addon').querySelector('.addon-price').innerText;
        selectedAddons.push({ title: addonTitle, price: addonPrice });
      }
    });
    localStorage.setItem('addons', JSON.stringify(selectedAddons));
  }


  function displaySummary() {
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const phone = localStorage.getItem('phone');
    const billingPeriod = localStorage.getItem('billingPeriod');
    const planName = localStorage.getItem('planName');
    const planPrice = localStorage.getItem('planPrice');
    const addons = JSON.parse(localStorage.getItem('addons'));

    document.getElementById('personal-info-summary').innerHTML = `
      <h4>Personal Info</h4>
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Phone: ${phone}</p>
    `;

    document.getElementById('plan-summary').innerHTML = `
      <h4>Selected Plan (${billingPeriod})</h4>
      <p>Plan: ${planName}</p>
      <p>Price: ${planPrice}</p>
    `;

    let addonsHtml = `<h4>Add-ons</h4>`;
    let totalAddonsPrice = 0;
    addons.forEach(addon => {
      addonsHtml += `<p>${addon.title}: ${addon.price}</p>`;
      const addonPrice = parseFloat(addon.price.replace(/[^\d.]/g, ''));
      totalAddonsPrice += addonPrice;
    });
    document.getElementById('addons-summary').innerHTML = addonsHtml;

    const planPriceValue = parseFloat(planPrice.replace(/[^\d.]/g, ''));
    const totalPrice = planPriceValue + totalAddonsPrice;
    document.getElementById('total-price').innerHTML = `Total Price: $${totalPrice.toFixed(2)} ${billingPeriod === 'yearly' ? '/yr' : '/mo'}`;
  }

 
  updateActiveCircle(0);
});


function switchPricing() {
  const toggle = document.getElementById('billing-toggle');
  
  if (toggle.checked) {
    document.getElementById('arcade-price').innerText = '$90/yr';
    document.getElementById('arcade-free-months').innerText = '2 months free';
    
    document.getElementById('advanced-price').innerText = '$120/yr';
    document.getElementById('advanced-free-months').innerText = '2 months free';
    
    document.getElementById('pro-price').innerText = '$150/yr';
    document.getElementById('pro-free-months').innerText = '2 months free';

    
    document.getElementById('addon1-price').innerText = '+$10/yr';
    document.getElementById('addon2-price').innerText = '+$20/yr';
    document.getElementById('addon3-price').innerText = '+$20/yr';
  } else {
    document.getElementById('arcade-price').innerText = '$9/mo';
    document.getElementById('arcade-free-months').innerText = '';
    
    document.getElementById('advanced-price').innerText = '$12/mo';
    document.getElementById('advanced-free-months').innerText = '';
    
    document.getElementById('pro-price').innerText = '$15/mo';
    document.getElementById('pro-free-months').innerText = '';

   
    document.getElementById('addon1-price').innerText = '+$1/mo';
    document.getElementById('addon2-price').innerText = '+$2/mo';
    document.getElementById('addon3-price').innerText = '+$2/mo';
  }
}

document.getElementById('billing-toggle').addEventListener('change', function() {
  if (this.checked) {
    document.querySelector('.billing-label-Monthly').style.color = '#666';
    document.querySelector('.billing-label-Yearly').style.color = '#04295A';
  } else {
    document.querySelector('.billing-label-Monthly').style.color = '#04295A';
    document.querySelector('.billing-label-Yearly').style.color = '#666';
  }
});

document.addEventListener('DOMContentLoaded', (event) => {
  const plans = document.querySelectorAll('.plan');

  plans.forEach(plan => {
    plan.addEventListener('click', function() {
      plans.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
    });
  });
});

function toggleActive(checkbox) {
  const addon = checkbox.closest('.addon');
  if (checkbox.checked) {
    addon.classList.add('active');
  } else {
    addon.classList.remove('active');
  }
}
