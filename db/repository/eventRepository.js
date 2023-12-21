const db = require("../db");

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
    const query = `INSERT INTO events (name, start_date, end_date, location, start_time, end_time,days) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [event.name, event.start_date, event.end_date || null, event.location, event.start_time, event.end_time, event.days || []];
    const result = await db.query(query, values);
    return result.rows[0];

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
    if(!id){
        console.log(`[!] id is required for deleting event`);
        throw new Error("Id is required");
    }
    const query="DELETE FROM event WHERE id="+id;
    const res=await db.query(query);
    return res!=null ? true : false;
}


function validateEvent(event) {
    if (!event.name || !event.start_date
        || !event.location || !event.start_time || !event.end_time) {
        return false
    }
    return true
}