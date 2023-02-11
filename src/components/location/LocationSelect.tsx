import { Stack, styled, Typography } from '@mui/material';
import { FC } from 'react';
import { useDispatch } from 'src/redux/store';
import { setLocation } from 'src/redux/slices/post/createSocialPost';
import { useRouter } from 'next/router';
import { PATH_APP } from 'src/routes/paths';
import { useCreatePlaceMutation } from 'src/_requests/graphql/post/mutations/createPlace.generated';
import { toast } from 'react-toastify';
import { setSharedPostLocation } from 'src/redux/slices/post/sharePost';

type Location = 'company' | 'home' | 'shop';
type locationType = 'social' | 'share';
export interface ILocationSelect {
  variant: Location;
  name: string;
  address: string;
  id: string;
  secondaryText: string;
  locationType?: locationType;
  postId?:string;
  
}

interface IComponentProps extends ILocationSelect {
  createPostLoadingChange: (loading: boolean) => void;
}

const RowWrapper = styled(Stack)(() => ({}));

const LocationSelect: FC<IComponentProps> = (props) => {
  const { variant, name, address, id, secondaryText, createPostLoadingChange, locationType = 'social', postId } = props;
  const { replace } = useRouter();
  const dispatch = useDispatch();

  const [createPlaceReq] = useCreatePlaceMutation();

  const createPostFunction = () => {
    createPostLoadingChange(true);
    createPlaceReq({ place: { dto: { id: id, description: address, mainText: name, secondaryText } } })
      .unwrap()
      .then((res) => {
        createPostLoadingChange(false);
        if (locationType == 'social') {
          dispatch(setLocation({ address, id, name, variant, secondaryText }));
          replace(PATH_APP.post.createPost.socialPost.index);
        } else if (locationType == 'share') {
          dispatch(setSharedPostLocation({ address, id, name, variant, secondaryText, locationType }));
         
            replace(`${PATH_APP.post.sharePost.index}/${postId}/`);
         
        }

      })
      .catch((err) => {
        createPostLoadingChange(false);
        toast.error(err.message);
      });
  };

  const getAvatarUrl = () => {
    switch (variant) {
      case 'company':
        return '/icons/location/building-4.svg';
      case 'home':
        return '/icons/location/location.svg';
      case 'shop':
        return '/icons/shop/bag-2.svg';
    }
  };

  return (
    <RowWrapper
      onClick={() => {
        createPostFunction();
      }}
      spacing={2}
      direction="row"
      sx={{ cursor: 'pointer' }}
    >
      <Stack spacing={0.5}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, lineHeight: '20px', color: 'text.primary' }}>
          {name}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 400, lineHeight: '17.5px', color: 'text.secondary' }}>
          {address}
        </Typography>
      </Stack>
    </RowWrapper>
  );
};

export default LocationSelect;
