import { Header, Nav, Main, Footer } from "./components";
import * as store from "./store";
import Navigo from "navigo";
import { capitalize } from "lodash";

const router = new Navigo("/");

function render(state = store.Home) {
  document.querySelector("#root").innerHTML = `
  ${Header(state)}
  ${Nav(store.Links)}
  ${Main(state)}
  ${Footer()}
  `;

  router.updatePageLinks();
}

router
.on({
  "/": () => render(),
  ":view": (params) => {
    let view = capitalize(params.data.view);
    if (view in store) {
      render(store[view]);
    } else {
      render(store.Viewnotfound);
      console.log(`View ${view} not defined`);
    }
  },
})
.resolve();

// add menu toggle to bars icon in nav bar
// document.querySelector(".fa-bars").addEventListener("click", () => {
//   document.querySelector("nav > ul").classList.toggle("hidden--mobile");
// });

router.hooks({
  before: (done, params) => {
    const view = params && params.data && params.data.view ? capitalize(params.data.view) : "Home";

    // Add a switch case statement to handle multiple routes
    switch (view) {
            // Added in Lesson 7.1
      case "Application":
        axios
          .get(`${process.env.WEATHER_HOLIDAY_API}/application`)
          .then(response => {
            store.Application.app = response.data;
            done();
          })
          .catch((error) => {
            console.log("It puked", error);
            done();
          });
          break;
      default :
        done();
    }
  },
  already: (params) => {
    const view = params && params.data && params.data.view ? capitalize(params.data.view) : "Home";

    render(store[view]);
  }
});

router
.on({
  "/": () => render(),
  ":view": (params) => {
    let view = capitalize(params.data.view);
    if (view in store) {
      render(store[view]);
    } else {
      render(store.Viewnotfound);
      console.log(`View ${view} not defined`);
    }
  },
})
.resolve();