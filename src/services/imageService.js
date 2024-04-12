const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '../../uploads');

// Obtener todas las imágenes
const getImages = () => {
    try {
        return fs.readdirSync(uploadsDir).map(file => ({
            filename: file,
            url: path.join(uploadsDir, file)
        }));
    } catch (error) {
        console.error('Failed to read directory:', error);
        return [];
    }
};

// Reemplazar todas las imágenes en el directorio
const uploadImages = async (files) => {
    try {
        // Mover los nuevos archivos
        for (const file of files) {
            const newPath = path.join(uploadsDir, file.originalname);
            await fs.promises.rename(file.path, newPath);
        }
    } catch (error) {
        console.error('Failed to replace images:', error);
        throw error;
    }
};

const cleanUpload = async() => {
    try {
        // Limpiar directorio uploads
        const existingFiles = await fs.promises.readdir(uploadsDir);
        for (const file of existingFiles) {
            await fs.promises.unlink(path.join(uploadsDir, file));
        }
    } catch (error) {
        console.error('Failed to clean images:', error);
        throw error;
    }
}

module.exports = {
    getImages,
    uploadImages,
    cleanUpload
};
