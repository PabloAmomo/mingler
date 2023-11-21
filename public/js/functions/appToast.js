const notifications = document.querySelector('.notifications');

// Posibles toast types: success, error, warning, info
const icons = {
  success:
    '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>',
  error:
    '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>',
  warning: '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></svg>',
  info: '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>',
  close:
    '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>'
};

const removeToast = (toast) => {
  toast.classList.add('toast-hide');
  if (toast.timeout) clearTimeout(toast.timeout);
  setTimeout(() => toast.remove(), 500);
};

const removeToastByTag = (tag) => {
  document.querySelectorAll(`[data-toast-tag="${tag}"]`).forEach((el) => {
    removeToast(el);
  });
};

const createToast = ({ icon, message, type = 'success', tag }) => {
  const timeout = 5000; // If change this, change animation time in css
  icon = icon || icons[type];
  const toast = document.createElement('li');
  toast.setAttribute('data-toast-tag', tag);
  const iconHtml = icon ? `<span class="wh-24 icon">${icon}</span>` : '';
  toast.className = `toast toast-animation-5s ${type} shadow-10`;
  toast.innerHTML = `<div class="content">
                        ${iconHtml}
                        <span class="message">${message}</span>
                      </div>
                      <span class="wh-24 close-icon">${icons.close}</span>`;
  toast.querySelector('.close-icon').addEventListener('click', (e) => removeToast(toast));
  notifications.appendChild(toast);
  toast.timeout = setTimeout(() => removeToast(toast), timeout);
};

export { createToast, removeToast, removeToastByTag };
