import { CaseCredentials } from 'types/case';
const isTitleValid = (title: unknown): boolean => {
  if (typeof title !== 'string' || title == undefined) return false;
  const regex = /^[a-zA-Z0-9 .,\'-]{5,50}$/;

  return regex.test(title);
};
const isDescriptionValid = (description: unknown) => {
  if (typeof description !== 'string' || description == undefined) return false;
  const regex = /^[a-zA-Z0-9 .,\'-]{5,500}$/;
  return regex.test(description);
};
const isStatusValid = (status: unknown): boolean => {
  if (typeof status !== 'string' || status == undefined) return false;
  const regex =
    /^(OPEN|REVIEW|ASSIGNED|IN_PROGRESS|ON_HOLD|RESOLVED|DISMISSED|CLOSED|PENDING)$/;
  return regex.test(status);
};

export const validateCaseData = (data: CaseCredentials): Error | undefined => {
  const { status, description, title } = data;
  if (!isTitleValid(title)) {
    return Error('Invalid title');
  }

  if (!isDescriptionValid(description)) {
    return Error('Invalid description');
  }
  if (!isStatusValid(status)) {
    return Error('Invalid Status');
  }
};
