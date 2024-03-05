const eventRepository = require("../db/repository/eventRepository");
const eventScheduleRepository = require("../db/repository/eventScheduleRepository");
module.exports = (router, auth) => {
    router.put("/event/schedule/:id",auth, async (req, res) => {
        try {

            const id = req.params.id;
            if (!id) return res.status(400).send("Id is required");
            console.log(`[+] id is  `, id);
            const result = await eventScheduleRepository.updateSchedule(id, req.body);
            return result != null ? res.sendStatus(200) : res.status(500).send("could not process the request");
        } catch (error) {
            console.log(error);
            return res.status(error.status || 500).send(error);
        }
    });
    router.get("/event/schedule", async (req, res) => {
        try {

            const query = req.query;
            if (!query || !query.month || !query.year) return res.status(400).send("query is required");
            console.log(`[+] query is `, query);
            const result = await eventScheduleRepository.getByMonthAndYear(query.day,query.month, query.year);
            return result != null ? res.status(200).send(result) : res.status(500).send("could not process the request");
        } catch (error) {
            console.log(error);
            return res.status(error.status || 500).send(error);
        }
    });
    router.get("/:id", async (req, res) => {
        const id = req.params.id;
        if (!id) return res.status(400).send("Id is required");

        const result = await eventRepository.get(id);
        return result != null ? res.status(200).send(result) : res.status(500).send("could not process the request");
    });

    router.post("/", auth, async (req, res, next) => {
        try {
            const payload = req.body;
            if (!payload) return res.status(400).send("payload is required");
            const result = await eventRepository.create(payload);
            return result != null ? res.status(200).send(result) : res.status(500).send("could not process the request");

        } catch (error) {
            console.log(error);
            return res.status(error.status || 500).send(error);
        }
    });

    router.put("/:id", auth, async (req, res, next) => {
        const id = req.params.id;
        const payload = req.body;
        if (!id || !payload) return res.status(400).send("Id and payload are required");
        const result = await eventRepository.update(id, payload);
        return result != null ? res.status(200).send(result) : res.status(500).send("could not process the request");
    })

    router.delete("/:id", auth, async (req, res, next) => {
        const id = req.params.id;
        if (!id) return res.status(400).send("Id is required");
        const result = await eventRepository.delete(id);
        return result != null ? res.status(200).send(result) : res.status(500).send("could not process the request");
    })

    return router;

}