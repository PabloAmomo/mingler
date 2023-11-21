import labels from './i18n-labels.js';

let language = 'en';

const getString = (id, variables) => {
  const label = labels[language];
  let result = label[id] || '**' + id + '**';
  if (variables) {
    Object.keys(variables).forEach((key) => {
      result = result.replace(new RegExp(`{${key}}`, 'g'), variables[key]);
    });
  }
  return result;
};

const changeLanguage = (lang) => {
  language = lang;
  setLabels();
};

const setLabels = (lang = language) => {
  document.querySelectorAll('[data-placeholder-id]').forEach((el) => {
    el.setAttribute('placeholder', getString(el.getAttribute('data-placeholder-id')));
  });
  document.querySelectorAll('[data-label-id]').forEach((el) => {
    el.innerHTML = getString(el.getAttribute('data-label-id'));
  });
};

export default { setLabels, getString, changeLanguage };
