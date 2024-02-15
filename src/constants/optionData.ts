export interface IOptionData {
  id: string;
  title: string;
  optionArray: string[];
}

const optionData: IOptionData[] = [
  {
    id: '1',
    title: 'Account Details',
    optionArray: ['Edit Profile', 'Change Password', 'Privacy', 'Language'],
  },
  {
    id: '2',
    title: 'Subscription',
    optionArray: ['Payment', 'Billing', 'Cancel'],
  },
  {
    id: '3',
    title: 'Support',
    optionArray: ['Fax', 'Contact', 'Send Feedback', 'Report a Problem'],
  },
  {
    id: '4',
    title: 'Option 4',
    optionArray: ['??', '??', '??'],
  },
  {
    id: '5',
    title: 'Option 5',
    optionArray: ['??', '??', '??'],
  },
  {
    id: '6',
    title: 'Option 6',
    optionArray: ['??', '??', '??'],
  },
];

export default optionData;
