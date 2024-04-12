const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const imageRoutes = require('./routes/imageRoutes');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",  // Permite solo desde este origen
        methods: ["GET", "POST"],  // Métodos HTTP permitidos en las solicitudes CORS
        allowedHeaders: ["x-client-header"],  // Headers permitidos en las solicitudes
        credentials: true  // Permite cookies de origen cruzado
    }
});
app.use(cors()); // Permite todas las solicitudes CORS

// Middleware para manejar datos de form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));


// Socket.io connections
io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    socket.on('error', (error) => {
        console.error('Socket.io error:', error);
    });
});


// Función para emitir a todos los clientes
const broadcast = (data) => {
    io.emit('updateImages', JSON.stringify(data));
};

// Rutas
app.use('/images', imageRoutes({ upload, broadcast }));

// Iniciar el servidor HTTP y Socket.io
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
