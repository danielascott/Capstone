import Navigo from "navigo";
import html from "html-literal";

const router = new Navigo("/");

const links = {
  home: { title: "Home" },
  about: { title: "About" },
  contact: { title: "Contact" },
  application: { title: "Application" },
};

export default () => html`
  <div class="dropdown">
    <button class="dropdown-button">Menu</button>
    <div class="dropdown-content">
      ${Object.keys(links)
        .map(
          (link) => `<a href="/${link}" data-navigo>${links[link].title}</a>`
        )
        .join("")}
    </div>
  </div>
`;
