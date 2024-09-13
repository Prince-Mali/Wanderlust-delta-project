(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
})()

// Filter scrollbar ----

const scrollContainer = document.querySelector('.scroll-content');
const scrollLeft = document.querySelector('.scroll-left');
const scrollRight = document.querySelector('.scroll-right');

scrollLeft.addEventListener('click', () => {
  scrollContainer.scrollBy({
      left: -150, // Adjust the scroll distance
      behavior: 'smooth'
  });
  checkButtons();
});

scrollRight.addEventListener('click', () => {
  scrollContainer.scrollBy({
      left: 120, // Adjust the scroll distance
      behavior: 'smooth'
  });
  checkButtons();
});


// Function to disable/enable scroll buttons based on position
function checkButtons() {
  if(scrollContainer.scrollLeft === 0){
    scrollLeft.style.display = 'none'
  } else {
    scrollLeft.style.display = 'inline';
  };
}

checkButtons();
