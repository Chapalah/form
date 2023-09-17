export const customModal = (children) => {
  return `
  <div class="modal">
    <div class="modal__container">
      <div class="modal__content">
        ${children}
      </div>
    </div>
  </div>
  `;
};

export const ininModalEvents = () => {
  document.querySelector('.js-modal-ok').addEventListener('click', () => {
    location.reload();
  })
}