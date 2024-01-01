import html from "html-literal";

export default (state) => html`
<header style="text-align: center;">
   <img src="${Meets}">
   <h1>${state.header}</h1>
</header>
`;