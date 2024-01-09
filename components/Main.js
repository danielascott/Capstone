import html from "html-literal";
import * as views from "./views";

export default (state) =>
  html`
    ${typeof views[state.view] === "function" ? views[state.view](state) : ""}
  `;
