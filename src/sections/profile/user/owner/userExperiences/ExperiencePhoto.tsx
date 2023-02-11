import { LoadingButton } from '@mui/lab';
import { Box, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import 'cropperjs/dist/cropper.css';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { EntityType } from 'src/@types/sections/serverTypes';
import Cropper from 'src/components/Cropper';
import { Icon } from 'src/components/Icon';
import { userExperienceSelector } from 'src/redux/slices/profile/userExperiences-slice';
import { useSelector } from 'src/redux/store';
import { useUploadImageMutation } from 'src/_requests/graphql/upload/mutations/createFile.generated';

interface PhotoProps {
  onChange: (value: string) => void;
  onClose: () => void;
}
function ExperiencePhoto(props: PhotoProps) {
  const { onChange, onClose } = props;
  const cropperRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [base64, setBase64] = useState<string | undefined>();
  const [image, setImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [uploadImage] = useUploadImageMutation();
  const experienceData = useSelector(userExperienceSelector);
  const theme = useTheme();

  useEffect(() => {
    if (!experienceData) router.push('/profile/user/experience/list');
  }, [experienceData, router]);

  const onCrop = async () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    // setImageCropper(cropper.getCroppedCanvas().toDataURL());
    setIsLoading(true);
    const res: any = await uploadImage({
      file: {
        dto: {
          entityType: EntityType.Person,
          type: image?.type?.split('/')[1],
          name: image?.name,
          binary: cropper.getCroppedCanvas().toDataURL().split(',')[1],
        },
      },
    });

    if (res?.data?.createFile?.isSuccess) {
      const url = res?.data!.createFile!.listDto!.items?.[0]!.url as string;
      onChange(url);
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    onClose();
  };

  const onSelectFile = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setBase64(reader.result as string);
        setImage(e.target.files[0]);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (inputRef) {
        inputRef.current?.click();
      }
    }, 100);
  }, [inputRef]);

  return (
    <>
      <input
        type="file"
        hidden
        ref={inputRef}
        style={{ display: 'hidden' }}
        id="photo-upload-experience"
        accept="image/*"
        onChange={onSelectFile}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
        <Stack direction="row" spacing={2}>
          <IconButton sx={{ p: 0 }} onClick={handleClose}>
            <Icon name="left-arrow-1" color="text.primary" />
          </IconButton>
          <Typography variant="subtitle2" color="text.primary">
            Add Experience Photo
          </Typography>
        </Stack>
      </Stack>
      <Divider sx={{ height: 2 }} />
      <Box sx={{ py: 2, textAlign: 'center', minHeight: 500 }}>
        {base64 && (
          <Cropper
            src={base64}
            // Cropper.js options
            // background={false}
            initialAspectRatio={16 / 9}
            guides={true}
            modal={false}
            // crop={onCrop}
            ref={cropperRef}
            checkOrientation={false}
            // cropend={onCrop}
            zoomTo={0.5}
            viewMode={1}
            cropBoxResizable={false}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            toggleDragModeOnDblclick={false}
          />
        )}
        {base64 && <Box sx={{ mt: 2 }} />}
        <LoadingButton
          loading={isLoading}
          onClick={() => (base64 ? onCrop() : inputRef.current?.click())}
          sx={{ width: '100%' }}
          variant="contained"
        >
          {base64 ? 'Save' : 'Add'}
        </LoadingButton>
      </Box>
    </>
  );
}

export default ExperiencePhoto;
