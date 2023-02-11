import { Box, styled } from '@mui/material';
import 'cropperjs/dist/cropper.css';
import { forwardRef } from 'react';
import ReactCropper, { ReactCropperProps } from 'react-cropper';

interface CropperProps extends ReactCropperProps {
  isRounded?: boolean;
}

const RootStyle = styled(Box)<{ isRounded?: boolean }>(({ theme, isRounded }) => ({
  '& span.cropper-view-box': {
    borderRadius: isRounded ? '50%' : '',
  },
  '& span.cropper-face.cropper-move': {
    borderRadius: isRounded ? '50%' : '',
  },
}));

const Cropper = forwardRef<HTMLImageElement, CropperProps>((props, ref) => {
  const { isRounded, initialAspectRatio, ...rest } = props;
  return (
    <RootStyle isRounded={isRounded}>
      <ReactCropper
        style={{ maxHeight: '50vh', width: '100%' }} {...rest} ref={ref} initialAspectRatio={isRounded ? 1 / 1 : initialAspectRatio} />
    </RootStyle>
  );
});

export default Cropper;
