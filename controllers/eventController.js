const eventRepository = require("../db/repository/eventRepository");
module.exports = (router, auth) => {
    router.get("/:id", async (req, res) => {
        const id = req.params.id;
        if (!id) return res.status(400).send("Id is required");

        const result = await eventRepository.get(id);
        return result != null ? res.status(200).send(result) : res.status(500).send("could not process the request");
    });

    router.post("/", auth, async (req, res, next) => {
        const payload = req.body;
        if (!payload) return res.status(400).send("payload is required");
        const result = await eventRepository.create(payload);
        return result != null ? res.status(200).send(result) : res.status(500).send("could not process the request");
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