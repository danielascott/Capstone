import html from "html-literal";

const defaultStartDate = new Date();
const defaultEndDate = new Date();
defaultEndDate.setHours(defaultStartDate.getHours() + 1);

export default (state) => html`
  <div id="application">
    <div class="left-column">
      <h4>Use this application to schedule appointments</h4>
      <section id="schedule">
        <form id="schedule-form" method="POST" action="">
          <h2>Create an Appointment</h2>
          <div>
              <input
                type="text"
                name="customer"
                id="customer"
                placeholder="Appointment Title"
                style="color: #5d0462;"
              />
            </div>
            <div>
              <input
                id="start"
                name="start"
                type="datetime-local"
                value="${defaultStartDate.toJSON().substring(0, 16)}"
                style="color: #5d0462;"
              />
            </div>
            <div>
              <input
                id="end"
                name="end"
                type="datetime-local"
                value="${defaultEndDate.toJSON().substring(0, 16)}"
                style="color: #5d0462;"
            />
          </div>

          <input type="submit" name="submit" value="Schedule Appointment" />
        </form>
      </section>
      <h4>
        All appointments are scheduled in Central Standard Time (CST). All open appointments are Tuesday through Friday, 9am to 5pm. And Thursday evenings, 6pm to 8pm.
    </div>
    <div class="right-column">
      <h3></h3>
      <h4>
        The weather in ${state.weather.city} is ${state.weather.description}.
        Temperature is ${state.weather.temp}F, and it feels like
        ${state.weather.feelsLike}F.
      </h4>
      <h4>
        Public holidays are: ${state.holidays.date}, ${state.holidays.name}
      </h4>
    </div>
  </div>
`;
