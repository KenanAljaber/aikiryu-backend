const db = require("../db");
const { createSchedule } = require("./eventScheduleRepository");

module.exports = {
    create,
    update,
    getAll,
    get,
    deleteEvent
}


async function create(event) {
    if (!validateEvent(event)) {
        console.log("[!] All fields are required");
        throw new Error("All fields are required");
    }
    const query = `INSERT INTO events (name, start_date, end_date, location) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [event.name, event.start_date, event.end_date || null, event.location];
    const result = await db.query(query, values);
    const createdEvent = result.rows[0];

    // Calculate the days between start and end dates
    const providedDays = data.days;
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    const days = [];
    for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
        if (!providedDays.includes(currentDate.getDay() + 1)) {
            const newEvent = createScheduleEventObj(currentDate, event.start_time,
                event.end_time, currentDate.getDay() + 1,
                createdEvent.id);
            await createSchedule(newEvent);
        }
    }

    return result.rows[0];

}

function createScheduleEventObj(date, startTime, endTime, day, eventId) {
    return {
        date,
        start_time: startTime,
        end_time: endTime,
        day: day,
        is_suspended: false,
        event_id: eventId


    }
}


async function update(eventId, data) {
    if (!data) {
        console.log("[!] Data is required");
        throw new Error("Data is required");
    }
    const event = await get(eventId);
    if (!event) {
        console.log("[!] Event not found");
        throw new Error("Event not found");
    }
    let query = "UPDATE event SET ";
    let values = [];
    let i = 1;
    for (const key in data) {
        if (event.hasOwnProperty(key)) {
            query += `${key} = $${i}, `;
            values.push(data[key]);
            i++;
        }
    }
    query = query.slice(0, -2) + ` WHERE id = ${eventId}`;
    console.log(query);
    const result = await db.query(query, values);
    return result.rows[0];
}


async function getAll() {

}


async function get(eventId) {
    const query = "SELECT * FROM events WHERE id = $1";
    const result = await db.query(query, [eventId]);
    return result.rows[0];
}


async function deleteEvent(id) {
    if (!id) {
        console.log(`[!] id is required for deleting event`);
        throw new Error("Id is required");
    }
    const query = "DELETE FROM event WHERE id=" + id;
    const res = await db.query(query);
    return res != null ? true : false;
}


function validateEvent(event) {
    if (!event.name || !event.start_date
        || !event.location || !event.start_time || !event.end_time) {
        return false
    }
    return true
}