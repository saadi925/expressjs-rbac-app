"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProfileCredentials = void 0;
const validateAvatar = (avatar) => {
    if (typeof avatar !== 'string' || avatar === null) {
        return false;
    }
    const regex = /^https?:\/\/.*\.(?:png|jpg|jpeg|gif)$/i;
    return regex.test(avatar);
};
const validateDisplayName = (displayname) => {
    if (typeof displayname !== 'string' || displayname === null) {
        return false;
    }
    const regex = /^[\w-]{1,20}$/;
    return regex.test(displayname);
};
const validateBio = (bio) => {
    if (typeof bio !== 'string' || bio === null) {
        return false;
    }
    const regex = /^.{1,160}$/;
    return regex.test(bio);
};
const validateProfileCredentials = (data) => {
    const { avatar, bio, displayname, location, phone } = data;
    if (!validateAvatar(avatar)) {
        return Error('Invalid avatar');
    }
    if (!validateBio(bio)) {
        return Error('Invalid bio');
    }
    if (!validateDisplayName(displayname)) {
        return Error('Invalid displayname');
    }
    if (typeof location !== 'string' || location === null) {
        return Error('Invalid location');
    }
    const regex = /^\+92[0-9]{10}$/;
    if (!phone || !regex.test(phone)) {
        return Error('Invalid phone number, must be start with +92 and 11 digits long');
    }
};
exports.validateProfileCredentials = validateProfileCredentials;
