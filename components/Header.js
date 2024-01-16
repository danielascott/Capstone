import html from "html-literal";
import logo from "/images/Calendar.jpeg";

export default (state) => html`
  <header style="display: grid; align-items: center; justify-content: center;">
    <img src="${logo}" alt="Logo" class="logo" />
    <h2>${state.header}</h2>
  </header>
`;
