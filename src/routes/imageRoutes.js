const express = require('express');
const fs = require('fs');
const imageService = require('../services/imageService');

module.exports = ({ upload, broadcast }) => {
    const router = express.Router();

    // Endpoint para subir múltiples imágenes
    router.post('/', upload.array('images', 10), async (req, res) => {
        try {
            await imageService.uploadImages(req.files);
            broadcast(imageService.getImages());
            res.status(200).json({ response: "OK" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // WebSocket endpoint para enviar imágenes actuales
    router.get('/', (req, res) => {
        res.json(imageService.getImages());
    });

    router.delete('/',async (req, res) => {
        try {
            await imageService.cleanUpload();
            res.status(200).json({ response: "OK" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};
