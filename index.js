import { Header, Nav, Main, Footer } from "./components";
import * as store from "./store";
import Navigo from "navigo";
import { capitalize } from "lodash";
import axios from "axios";

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


// add menu toggle to bars icon in nav bar
// document.querySelector(".fa-bars").addEventListener("click", () => {
//   document.querySelector("nav > ul").classList.toggle("hidden--mobile");
// });

router.hooks({
  before: async (done, params) => {
    const view = params && params.data && params.data.view ? capitalize(params.data.view) : "Home";

    // Add a switch case statement to handle multiple routes
    switch (view) {
      case "Application":
        await axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.OPEN_WEATHER_MAP_API_KEY}&q=st%20louis`
          )
          .then(response => {
            const kelvinToFahrenheit = kelvinTemp =>
              Math.round((kelvinTemp - 273.15) * (9 / 5) + 32);

            store.Application.weather = {
              city: response.data.name,
              temp: kelvinToFahrenheit(response.data.main.temp),
              feelsLike: kelvinToFahrenheit(response.data.main.feels_like),
              description: response.data.weather[0].main
            };

        })
        .catch((err) => {
          console.log(err);

        });
        await axios
        .get(
          process.env.PUBLIC_HOLIDAY_API
        )
        .then(response => {
          
          store.Application.holidays = response 

      })
      .catch((err) => {
        console.log(err);

      });
      done();
      break;
      // Added in Lesson 7.1
      case "Pizza":
        axios
          .get(`${process.env.PIZZA_PLACE_API_URL}/pizzas`)
          .then(response => {
            store.Pizza.pizzas = response.data;
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
