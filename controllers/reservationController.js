const mongoose = require('mongoose');
const MeetingRoom = require('../models/MeetingRoom');
const Reservation = require('../models/Reservation');
const User = require('../models/User');




exports.getAllReservation = async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate('user', 'username') // Populates the user field with the username
            .populate('meetingRoom', 'name'); // Populates the meetingRoom field with the name

        res.send(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};


exports.createReservation = async (req, res) => {
    try {
        const { username, roomName, date, timeSlot } = req.body;

        // Find the user by their username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the room by its name
        const room = await MeetingRoom.findOne({ name: roomName });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Ensure availability is an array
        if (!Array.isArray(room.availability)) {
            room.availability = [];
        }

        // Check if the room is available for the given date and time slot
        const existingReservation = room.availability.find(avail => avail.date === date);
        if (existingReservation && existingReservation.timeSlots.includes(timeSlot)) {
            return res.status(400).json({ message: 'Room already reserved for the selected time slot' });
        }

        // Update the room availability
        if (existingReservation) {
            existingReservation.timeSlots.push(timeSlot);
        } else {
            room.availability.push({ date, timeSlots: [timeSlot] });
        }
        await room.save();

        // Create a new reservation record
        const newReservation = new Reservation({
            user: user._id,
            meetingRoom: room._id,
            date,
            timeSlot,
        });
        await newReservation.save();

        res.status(201).json({ message: 'Room reserved successfully', reservation: newReservation });
    } catch (error) {
        console.error('Error reserving room:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getUserReservations = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming the user ID is available in the request object

        const reservations = await Reservation.find({ user: userId })
            .populate('meetingRoom', 'name');

        res.send(reservations);
    } catch (error) {
        console.error('Error fetching user reservations:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};