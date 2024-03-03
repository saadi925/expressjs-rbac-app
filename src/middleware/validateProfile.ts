import { ProfileCredentials } from 'types/profile';

const validateAvatar = (avatar: unknown) => {
  if (typeof avatar !== 'string' || avatar === null) {
    return false;
  }
  const regex = /^https?:\/\/.*\.(?:png|jpg|jpeg|gif)$/i;
  return regex.test(avatar);
};

const validateDisplayName = (displayname: unknown) => {
  if (typeof displayname !== 'string' || displayname === null) {
    return false;
  }
  const regex = /^[\w-]{1,20}$/;
  return regex.test(displayname);
};

const validateBio = (bio: unknown) => {
  if (typeof bio !== 'string' || bio === null) {
    return false;
  }
  const regex = /^.{1,160}$/;
  return regex.test(bio);
};

export const validateProfileCredentials = (data: ProfileCredentials) => {
  const { avatar, bio, displayname, location } = data;
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
};
