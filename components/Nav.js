import html from "html-literal";

export default (links) => html`
  <div class="dropdown">
    <button class="dropdown-button">Menu</button>
    <div class="dropdown-content">
      ${links
        .map(
          (link) =>
            `<li><a href="/${link.title}" title="${link.title}" data-navigo>${link.text}</a></li>`
        )
        .join("")}
    </div>
  </div>
`;
