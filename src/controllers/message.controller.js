import cloudinary from '../config/cloudinary.js';
import Message from '../models/message.mode.js';
import User from '../models/user.model.js';

const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select('-password');

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log('Error in getUsers', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: loggedInUserId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log('Error in getMessages controller', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    // current loggedIn user
    const senderId = req.user._id;

    let imageUrl;

    if (image) {
      // upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    //todo: realtime functionality goes here => socket.io

    res.status(201).json(newMessage);
  } catch (error) {
    console.log('Error in sendMessage controler', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { getUsers, getMessages, sendMessage };
