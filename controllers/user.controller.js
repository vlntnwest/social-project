const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

module.exports.userInfo = async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) return res.status(400).send("ID unknown : " + id);

  try {
    const user = await UserModel.findById(id).select("-password");
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    console.error("Error while fetching user:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.updateUser = async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(400).send("ID unknown : " + id);
  }

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: id },
      { $set: { bio: req.body.bio } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();

    return res.send(updatedUser);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(400).send("ID unknown : " + id);
  }

  try {
    const deleteUser = await UserModel.deleteOne({ _id: id }).exec();

    return res.send(deleteUser);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.follow = async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id) || !ObjectID.isValid(req.body.idToFollow)) {
    return res.status(400).send("ID unknown : " + id);
  }

  try {
    // add to the follower list
    const followedUser = await UserModel.findByIdAndUpdate(
      id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true }
    ).exec();

    // add to following list
    const followerUser = await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: id } },
      { new: true, upsert: true }
    ).exec();

    return res.send({ followedUser, followerUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.unfollow = async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id) || !ObjectID.isValid(req.body.idToUnfollow)) {
    return res.status(400).send("ID unknown : " + id);
  }

  try {
    // add to the follower list
    const unFollowedUser = await UserModel.findByIdAndUpdate(
      id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true }
    ).exec();

    // add to following list
    const unFollowerUser = await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: id } },
      { new: true, upsert: true }
    ).exec();

    return res.send({ unFollowedUser, unFollowerUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
