import {html , Type} from 'https://doc.typable.dev/js/deps.js';
import {Window} from 'https://doc.typable.dev/js/component/mod.js';

export default class Calendar extends Window {
    static name = 'calendar-app';
    static properties = {
        ...super.properties,
        calendar: Type.object({}),
        selectedMonth: Type.number(0),
        mode: Type.string("month"),
        createEvent: Type.boolean(false),
        event: Type.object({}),
    };

    static ref = {
        ...super.ref,
        createEvent: '.js-create-event',
        createEventSubmit: '.js-create-event-submit'
    };

    constructor() {
        super();
        this.onAppLoading();
    }

    renderBody() {
        return html`
            <div class="calendar__container"> 

            <div class="js-create-event calendar__create-event" style="display: none;" @click="${e => this.closeModal(e)}">
                <div class="calender__create-event__modal">
                    <h2>Neuer Termin</h2>
                    <form class="js-create-event-submit">
                        <input type="text" name="title" id="newEvent-title" placeholder="Title" value="${this.event?.title}" />
                        <input type="date" name="start" id="newEvent-start" placeholder="Start Tag" .valueAsDate=${this.event?.startDate}/>
                        <input type="date" name="end" id="newEvent-end" placeholder="End Tag" .valueAsDate=${this.event?.endDate}/>
                        <input type="color" name="color" id="newEvent-color" placeholder="Color" value="${this.event?.color}"/>
                        <button type="button" @click="${this.setEventsForDate}">Speichern</button>
                    </form>
                </div>
            </div>
             <div class="controls">
                <button @click=${this.back}>Back</button>
                <span>${this.calendar?.currentMonth}</span>
                <button @click=${this.next}>Next</button>
            </div>
            <div class="table">
                <ul class="table-head">
                    <li>Mon</li>
                    <li>Tue</li>
                    <li>Wed</li>
                    <li>Thu</li>
                    <li>Fri</li>
                    <li>Sat</li>
                    <li>Sun</li>
                </ul>
                <ul class="table-body">
                    ${this.mode == "day" ? this.calendar?.days?.map(currentDay => {
                        return html`
                            <li @click=${() => this.addEvents(currentDay)}>
                                <p>${currentDay.day}</p>
                            </li>      
                        `;
                    }) : null}
                    ${this.mode == "month" && this.calendar?.weeks?.map((currentWeek, weekIndex) => {
                        return html`
                            <div class="calendar__week__wrapper">
                                <div class="calendar__days__wrapper">
                                    ${currentWeek.map((currentDay, index) => {
                                        return html`
                                            <div data-week=${weekIndex} data-index="${weekIndex}${index}" class="calendar__days__item ${currentDay.empty ? 'empty' : ''} ${currentDay.currentDay ? 'currentDay' : ''}" @click=${(e) => this.addEvents(e,currentDay)}>
                                                <div>${currentDay.day}</div>

                                                        <div class="calendar__events__day" data-event-index="${weekIndex}${index}">
                                                        ${currentDay?.events?.map(currentEvent => {
                                                            return html`
                                                                <div  class="calendar__events__item ${ currentEvent.first || index === 0  ? "first" : "" } ${ currentEvent.last || index === 6  ? "last" : "" }" style="background-color: ${currentEvent.color}">
                                                                    <span> 
                                                                        ${ currentEvent.first ||  index === 0 ? currentEvent.title : "" }
                                                                    </span>
                                                                </div>      
                                                            `;
                                                        })} 
                                                        </div>
                                     
                                            </div>      
                                        `;
                                    })} 
                                </div>
                                <div class="calendar__days__events__wrapper">
                                    ${currentWeek.map((currentDay, index) => {
                                        
                                    })} 
                                </div>
                            </div>
                        `;
                    })}
                </ul>
            </div>
        `; 
    }

    onAppLoading() { 
        this.getCalendarMonth();
    }

    back() {
        this.selectedMonth--;
        this.getCalendarMonth();
    }
    
    next() {
        this.selectedMonth++;
        this.getCalendarMonth();
    }

    closeModal(e) {
        console.log(e.target);
        if (this.createEvent === e.target) {
            this.createEvent.style.display = "none";
        }
    }

    addEvents(e, currentDay) {
        this.event.title = "Neues Event";
        this.event.startDate = currentDay.date;
        this.event.endDate = currentDay.date;
        this.event.color = "#cccccc;"
        this.requestUpdate();
        this.createEvent.style.display = "flex";  
    }

    
    getCalendar() {
        const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
        
        
        // Get Current Date
        const dt = new Date();

        if (this.selectedMonth !== 0) {
            dt.setMonth(new Date().getMonth() + this.selectedMonth);
        }
        
        const day = dt.getDate();
        const month = dt.getMonth();
        const year = dt.getFullYear();
        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonthString = firstDayOfMonth.toLocaleDateString('en-us', {weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric'});
        const paddingDays = weekdays.indexOf(firstDayOfMonthString.split(', ')[0]);
        
        //Create calendar
        this.calendar.days = [];
        this.calendar.currentMonth =`${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

      
        for(let i = 1; i <= paddingDays + daysInMonth; i++) {
          const dayItem = {};

          if (i > paddingDays) {
            const currentDay = i - paddingDays;
            const dayDate = new Date(year, month, currentDay)
            dayItem.day = currentDay;
            dayItem.name = dayDate.toLocaleDateString('de-DE', {weekday: 'long'});
            dayItem.date = dayDate;
            dayItem.currentDay = (currentDay === day && this.selectedMonth === 0);
            dayItem.events = this.getEventsByDate(dayDate);
          } else {
            dayItem.empty = true;
            dayItem.events = [];
          }
          this.calendar.days.push(dayItem);    
        
        }
    }


    
    getCalendarMonth() {
        const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
        
        
        // Get Current Date
        const dt = new Date();

        if (this.selectedMonth !== 0) {
            dt.setMonth(new Date().getMonth() + this.selectedMonth);
        }
        
        const day = dt.getDate();
        const month = dt.getMonth();
        const year = dt.getFullYear();
        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonthString = firstDayOfMonth.toLocaleDateString('en-us', {weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric'});
        const paddingDays = weekdays.indexOf(firstDayOfMonthString.split(', ')[0]);
        
        //Create calendar
        this.calendar.weeks = [];
        this.calendar.currentMonth =`${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

        let dayInt = 0;
        let week = []
        for(let i = 1; i <= paddingDays + daysInMonth; i++) {
            dayInt++;
            const dayItem = {};
            if (i > paddingDays) {
                const currentDay = i - paddingDays;
                const dayDate = new Date(year, month, currentDay, 2, 0, 0, 0)
                dayItem.day = currentDay;
                dayItem.name = dayDate.toLocaleDateString('de-DE', {weekday: 'long'});
                dayItem.date = dayDate;
                dayItem.currentDay = (currentDay === day && this.selectedMonth === 0);
                dayItem.events = this.getEventsByDate(dayDate);
            } else {
                dayItem.empty = true;
                dayItem.events = [];
            }
            week.push(dayItem);    

            if (dayInt === 7 || i == (paddingDays + daysInMonth)) {
                dayInt = 0;
                this.calendar.weeks.push(week);
                week = [];
            }
        }
        console.log(this.calendar)
    }

    getEventsByDate(date) {
        const eventList = this.storage.get('events') ? this.storage.get('events') : [];
        const eventForDay = eventList.filter(e => {     
            const startDate = new Date(e.startDate).getTime();
            const endDate = new Date(e.endDate).getTime();
            return (date.getTime() >= startDate  && date.getTime() <= endDate);
        });
        if(eventForDay.length <= 0) {
            //eventForDay.push({"empty": true})
        }
        
        eventForDay.forEach(event => {
            const startDay = new Date(event.startDate).getDate();
            const endDay = new Date(event.endDate).getDate();

            event.first = startDay == date.getDate();
            event.last = (endDay == date.getDate()) || (event.totalDays === 0);
        });

        eventForDay.sort(function(a, b) {
            return b.totalDays-a.totalDays;
        });


        return eventForDay;
    }

    setEventsForDate() {
        const eventForm = new FormData(this.createEventSubmit)
        const eventList = this.storage.get('events') ? this.storage.get('events') : [];

        //Dummy Data
        const dt = new Date();
        const currentDay = dt.getDate();
        const month = dt.getMonth();
        const year = dt.getFullYear();

        const event = {};
        event.title = eventForm.get("title");
        event.description = " ";
        event.calendarId = 1;
        event.color = eventForm.get("color");
        event.startDate = new Date(eventForm.get("start")).getTime();
        event.endDate = new Date(eventForm.get("end")).getTime();
        event.totalDays = this.getNumberOfDays( event.startDate, event.endDate);
        eventList.push(event)

        console.log(eventList)
        
        this.storage.set('events', eventList)
        this.getCalendarMonth();
        this.requestUpdate();
    }

    getNumberOfDays(start, end) {
        const startDate = new Date(start)
        const endDate = new Date(end)
        // One day in milliseconds
        const oneDay = 1000 * 60 * 60 * 24;
    
        // Calculating the time difference between two dates
        const diffInTime = endDate.getTime() - startDate.getTime();
    
        // Calculating the no. of days between two dates
        const diffInDays = Math.round(diffInTime / oneDay);
    
        return diffInDays;
    }


    
}

