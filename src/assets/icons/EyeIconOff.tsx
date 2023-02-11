import { SvgIcon, SvgIconProps } from '@mui/material';

export default function (props: SvgIconProps) {
  return (
    <SvgIcon {...props} sx={{ backgroundColor: 'transparent' }}>
      <path
        fill="#ffffff"
        d="M12.2523 19.8604C15.6352 19.8604 18.7881 17.8671 20.9827 14.4171C21.8452 13.0658 21.8452 10.7946 20.9827 9.44333C18.7881 5.99333 15.6352 4 12.2523 4C8.86938 4 5.71646 5.99333 3.52188 9.44333C2.65937 10.7946 2.65937 13.0658 3.52188 14.4171C5.71646 17.8671 8.86938 19.8604 12.2523 19.8604Z"
        stroke="inherit"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        fill="#ffffff"
        d="M15.6834 11.935C15.6834 13.8325 14.1501 15.3658 12.2526 15.3658C10.3551 15.3658 8.82178 13.8325 8.82178 11.935C8.82178 10.0375 10.3551 8.50415 12.2526 8.50415C14.1501 8.50415 15.6834 10.0375 15.6834 11.935Z"
        stroke="inherit"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <line
        fill="#ffffff"
        x1="1"
        y1="-1"
        x2="24.7148"
        y2="-1"
        transform="matrix(0.894429 0.447211 -0.447217 0.894426 0 6.875)"
        stroke="inherit"
        stroke-width="2"
        stroke-linecap="round"
      />
    </SvgIcon>
  );
}
