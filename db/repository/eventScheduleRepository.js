const db = require("../db");
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

module.exports = {
    createSchedule: create,
    getByEventId: getByEventId,
    getByMonthAndYear: getByWeek,
    updateSchedule: update
}

async function create(eventSchedule) {
    console.log(`[+] Creating event schedule:`, eventSchedule);
    if (!validateSchedule(eventSchedule)) {
        console.log("[!] All fields are required");
    }
    const id = uuidv4();
    const query = `INSERT INTO event_schedule (id,event_id, date, start_time, end_time, day, is_suspended) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [id, eventSchedule.event_id, eventSchedule.date, eventSchedule.start_time, eventSchedule.end_time, eventSchedule.day, eventSchedule.is_suspended || false];
    const result = await db.query(query, values);
    console.log(`[+] Event schedule created:`, result.rows[0]);
    return result.rows[0];
}

async function getByEventId(eventId) {
    const query = `SELECT * FROM event_schedule WHERE event_id = $1`;
    const result = await db.query(query, [eventId]);
    return result.rows;
}

async function getByWeek(day, month, currentYear) {
    const formattedDate = new Date(currentYear, month, day);
    //add 7 days
    const fromDate= moment(formattedDate).subtract(7, 'days').toDate();
    const toDate = moment(formattedDate).add(7, 'days').toDate();
    const query = `SELECT es.id, event.name, event.location, es.date, es.start_time, es.end_time, es.day, es.is_suspended, event.id as event_id
    FROM event_schedule AS es
    INNER JOIN event ON es.event_id = event.id
    WHERE es.date BETWEEN $1 AND $2
    `;

    const result = await db.query(query, [fromDate, toDate]);
    return result.rows;
}

async function update(id, data) {
    if (!data) {
        console.log("[!] Data is required");
    }
    const is_suspended = data.is_suspended ?? false;
    const query = `UPDATE event_schedule SET is_suspended = $1 WHERE id = $2`;
    const result = await db.query(query, [is_suspended, id]);
    console.log(`[+] Event schedule updated:`, result);
    return result.rowCount;

}


function validateSchedule(data) {
    if (!data.start_time || !data.end_time || !data.day || !data.date || !data.event_id) {
        return false
    }
    return true
}


