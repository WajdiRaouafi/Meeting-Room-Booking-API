const MeetingRoom = require('../models/MeetingRoom');


exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await MeetingRoom.find();
        res.send(rooms);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.createMeetingRoom = async (req, res) => {
    try {
        const { name, capacity, equipment,availability } = req.body;

        // Check if a room with the same name already exists
        const existingRoom = await MeetingRoom.findOne({ name });
        if (existingRoom) {
            return res.status(400).json({ message: 'A room with the same name already exists' });
        }

        // Create a new meeting room
        const newRoom = new MeetingRoom({ name, capacity, equipment,availability });
        await newRoom.save();

        res.status(201).json({ message: 'Meeting room created successfully', room: newRoom });
    } catch (error) {
        console.error('Error creating meeting room:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.reserveRoom = async (req, res) => {
    try {
        const { roomId, date, timeSlot } = req.body;

        // Check if the room exists
        const room = await MeetingRoom.findById(roomId);
        if (!room) {
            return res.status(404).send({ message: 'Room not found' });
        }

        // Check if the room is available for the given date and time slot
        const existingReservation = room.availability.find(avail => avail.date === date);
        if (existingReservation && existingReservation.timeSlots.includes(timeSlot)) {
            return res.status(400).send({ message: 'Room already reserved for the selected time slot' });
        }

        // Update the room availability
        if (existingReservation) {
            existingReservation.timeSlots.push(timeSlot);
        } else {
            room.availability.push({ date, timeSlots: [timeSlot] });
        }
        await room.save();

        res.status(201).send({ message: 'Room reserved successfully' });
    } catch (error) {
        console.error('Error reserving room:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};