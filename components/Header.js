import html from "html-literal";
import logo from "/images/CalendarMeets.jpeg";

export default (state) => html`
  <header style="text-align: center;">
    <h1>${state.header}</h1>
    <img src="${logo}" alt="Your Image" />
  </header>
`;
