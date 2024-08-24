window.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("timetable")

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const selectedDay = document.getElementById("event-select").value
    const EventName = document.getElementById("event-name")

    let schedule = JSON.parse(localStorage.getItem("schedule")) || {};

    localStorage.setItem("schedule", JSON.stringify(schedule))

    if (EventName.value != '') {
      if (!schedule[selectedDay]) {
        schedule[selectedDay] = []
      }
      schedule[selectedDay].push(EventName.value)

      localStorage.setItem("schedule", JSON.stringify(schedule))
      UpdateEvents()
      EventName.value = ''
    }
  });

  function UpdateEvents() {
    const schedule = JSON.parse(localStorage.getItem("schedule"))
    for (let day in schedule)  {
      const events = schedule[day]
      const wrapper = document.getElementById(day)
      wrapper.innerHTML = ""
      if (events) {
        events.forEach(event => {
          const Newevent = document.createElement('li')
          Newevent.classList.add("event")

          const desc = document.createElement('p')
          desc.textContent = event
          Newevent.appendChild(desc)

          wrapper.appendChild(Newevent)
        });
      }
    }
  }
  UpdateEvents()
})