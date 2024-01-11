import html from "html-literal";

export default (state) => html`
  <header style="text-align: center;">
    <h1>${state.header}</h1>
    <img src="./Calendar-Meets" alt="Your Image" />
  </header>
`;
