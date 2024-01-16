import { Header, Nav, Main, Footer } from "./components";
import * as store from "./store";
import Navigo from "navigo";
import { capitalize } from "lodash";
import axios from "axios";

const router = new Navigo("/");
var calendar;

function render(state = store.Home) {
  document.querySelector("#root").innerHTML = `
  ${Header(state)}
  ${Nav(store.Links)}
  ${Main(state)}
  ${Footer()}
  `;

  router.updatePageLinks();

  addEventListeners(state);
}

function handleEventDragResize(info) {
  const event = info.event;

  if (confirm("Are you sure about this change?")) {
    const requestData = {
      customer: event.title,
      start: event.start.toJSON(),
      end: event.end.toJSON(),
      url: event.url,
    };

    axios
      .put(`${process.env.API_URL}/appointments/${event.id}`, requestData)
      .then((response) => {
        console.log(
          `Event '${response.data.customer}' (${response.data._id}) has been updated.`
        );
      })
      .catch((error) => {
        info.revert();
        console.log("It puked", error);
      });
  } else {
    info.revert();
  }
}

function addEventListeners(st) {
  // add menu toggle to bars icon in nav bar
  document
    .querySelector(".dropdown-content")
    .addEventListener("click", () =>
      document.querySelector("nav > ul").classList.toggle("hidden--mobile")
    );

  if (st.view === "Application") {
    document.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();

      const inputList = event.target.elements;

      const requestData = {
        customer: inputList.customer.value,
        start: new Date(inputList.start.value).toJSON(),
        end: new Date(inputList.end.value).toJSON(),
      };

      axios
        .post(`${process.env.API_URL}`, requestData)
        .then((response) => {
          // Push the new pizza onto the Pizza state pizzas attribute, so it can be displayed in the pizza list
          store.Appointments.appointments.push(response.data);
          router.navigate("/appointments");
        })
        .catch((error) => {
          console.log("It puked", error);
        });
    });
  }

  if (st.view === "Appointments" && st.appointments) {
    const calendarEl = document.getElementById("calendar");
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      buttonText: {
        today: "Today",
        month: "Month",
        week: "Week",
        day: "Day",
        list: "List",
      },
      height: "100%",
      dayMaxEventRows: true,
      navLinks: true,
      editable: true,
      selectable: true,
      eventClick: function(info) {
        // change the border color just for fun
        info.el.style.borderColor = "red";
      },
      eventDrop: function(info) {
        handleEventDragResize(info);
      },
      eventResize: function(info) {
        handleEventDragResize(info);
      },
      select: (info) => {
        const customer = prompt("Please enter a title");

        if (customer) {
          const requestData = {
            customer: customer,
            start: info.start.toJSON(),
            end: info.end.toJSON(),
            allDay: info.view.type === "dayGridMonth",
          };

          axios
            .post(`${process.env.API_URL}`, requestData)
            .then((response) => {
              // Push the new pizza onto the Pizza state pizzas attribute, so it can be displayed in the pizza list
              response.data.title = response.data.customer;
              response.data.url = `/appointments/${response.data._id}`;
              console.log("matsinet-response.data:", response.data);
              store.Appointments.appointments.push(response.data);
              console.log(
                `Event '${response.data.customer}' (${response.data._id}) has been created.`
              );
              calendar.addEvent(response.data);
              calendar.unselect();
            })
            .catch((error) => {
              console.log("It puked", error);
            });
        } else {
          calendar.unselect();
        }
      },
      events: st.appointments || [],
    });
    calendar.render();
  }

  if (st.view === "Appointments" && st.event) {
    const deleteButton = document.getElementById("delete-appointment");
    if (deleteButton) {
      deleteButton.addEventListener("click", (event) => {
        deleteButton.disabled = true;
        console.log(
          "matsinet-event.target.dataset.id:",
          event.target.dataset.id
        );

        if (confirm("Are you sure you want to delete this appointment")) {
          axios
            .delete(
              `${process.env.API_URL}/appointments/${event.target.dataset.id}`
            )
            .then((response) => {
              // Push the new pizza onto the Pizza state pizzas attribute, so it can be displayed in the pizza list
              console.log(
                `Event '${response.data.customer}' (${response.data._id}) has been deleted.`
              );
              router.navigate("/appointments");
            })
            .catch((error) => {
              console.log("It puked", error);
            });
        } else {
          deleteButton.disabled = false;
        }
      });
    }
  }
}
// add menu toggle to bars icon in nav bar
// document.querySelector(".fa-bars").addEventListener("click", () => {
//   document.querySelector("nav > ul").classList.toggle("hidden--mobile");
// });

router.hooks({
  before: async (done, params) => {
    const view =
      params && params.data && params.data.view
        ? capitalize(params.data.view)
        : "Home";

    // Add a switch case statement to handle multiple routes
    switch (view) {
      case "Application":
        await axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.OPEN_WEATHER_MAP_API_KEY}&q=floresville`
          )
          .then((response) => {
            const kelvinToFahrenheit = (kelvinTemp) =>
              Math.round((kelvinTemp - 273.15) * (9 / 5) + 32);

            store.Application.weather = {
              city: response.data.name,
              temp: kelvinToFahrenheit(response.data.main.temp),
              feelsLike: kelvinToFahrenheit(response.data.main.feels_like),
              description: response.data.weather[0].main,
            };
          })
          .catch((err) => {
            console.log(err);
          });
        await axios
          .get(process.env.PUBLIC_HOLIDAY_API)
          .then((response) => {
            store.Application.holidays = {
              date: response.data.date,
              name: response.data.name,
            };
          })
          .catch((err) => {
            console.log(err);
          });
        done();
        break;
      // Added in Lesson 7.1
      default:
        done();
    }
  },
  already: (params) => {
    const view =
      params && params.data && params.data.view
        ? capitalize(params.data.view)
        : "Home";

    render(store[view]);
  },
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
