'use script';

const hiddenModal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnOpenModals = document.querySelectorAll('.show-modal');

const btncloseModal = document.querySelector('.close-modal');

const openAndCloseModal = function () {
  hiddenModal.classList.toggle('hidden');
  overlay.classList.toggle('hidden');
};

for (let i = 0; i < btnOpenModals.length; i++)
  btnOpenModals[i].addEventListener('click', openAndCloseModal);

btncloseModal.addEventListener('click', openAndCloseModal);
overlay.addEventListener('click', openAndCloseModal);

document.addEventListener('keydown', function (event) {
  //   console.log(event, event.key);
  if (event.key === 'Escape' && !hiddenModal.classList.contains('hidden'))
    openAndCloseModal();
});

// instead of using "toggle" in  openAndCloseModal function we could check in the condition that if(!(modal.classList.contains('hidden'))), means if hidden class in modal element is not present than remove the 'hidden' class from the modal element.
// NOTE-: as we know "classList" & "nodeList" are document object's and we have methods attached to them and "classList.contains('hidden')" is one of them.
// NOTE-: keydown-: as the key is pressed, keypress-: when user keeps on pressing the key , keyup-: when user releases the key.
