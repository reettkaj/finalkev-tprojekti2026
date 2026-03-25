import '../css/style.css';
import '../css/mobile.css';

let name = localStorage.getItem('name');

const usernameElement = document.querySelector('.username');

if (usernameElement) {
  usernameElement.textContent = name ? name : 'vieras';
}