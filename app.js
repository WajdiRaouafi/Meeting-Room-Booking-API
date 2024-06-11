const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');
const meetingRoomRoutes = require('./routes/meetingRoomRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/meeting-room-booking', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use('/users', userRoutes);
app.use('/rooms', meetingRoomRoutes);
app.use('/reservations', reservationRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
