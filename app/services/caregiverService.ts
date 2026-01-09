type Caregiver = {
  name: string;
  phone: string;
};

const caregivers: Caregiver[] = [
  { name: 'Mom', phone: '+91XXXXXXXXXX' },
  { name: 'Dad', phone: '+91XXXXXXXXXX' },
];

export const notifyCaregivers = (
  message: string,
  locationLink?: string
) => {
  caregivers.forEach((c) => {
    console.log(
      `SMS to ${c.phone}: ${message} ${
        locationLink ? `Location: ${locationLink}` : ''
      }`
    );
  });
};
