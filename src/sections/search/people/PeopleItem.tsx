//mui
import { Stack, styled, Typography, Avatar, Tooltip } from '@mui/material';
//iconSax
import { createRef, FC } from 'react';
import { FilterByEnum, ItemTypeEnum } from 'src/@types/sections/serverTypes';
import { ISearchUserResponse } from 'src/@types/user';
import useIsOverflow from 'src/hooks/useIsOverflow';
import ProfileButtonChecker from 'src/sections/profile/components/ProfileButtonChecker';
import CustomLink from 'src/components/CustomLink';
import { PATH_APP } from 'src/routes/paths';
import { useAddLastSeenMutation } from 'src/_requests/graphql/search/mutations/addLastSeen.generated';
import { useRouter } from 'next/router';
import { ClickableText } from '../SharedStyled';
export const PeopleItemStyle = styled(Stack)(({ theme }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: theme.spacing(2),
}));

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
}));

const PeopleItem: FC<{ people: ISearchUserResponse; index: number; varient?: 'ngo' | 'normal' }> = ({
  people,
  index,
  varient,
}) => {
  const { push } = useRouter();
  const fullnameRef = createRef<any>();
  const headlineRef = createRef<any>();
  const fullnameIsOverflow = useIsOverflow(fullnameRef);
  const headlineIsOverflow = useIsOverflow(headlineRef);
  const [addLastSeenRequest] = useAddLastSeenMutation();

  const handleRouting = () => {
    addLastSeenRequest({ filter: { dto: { itemId: people.id, itemType: ItemTypeEnum.People } } });
    push(`${PATH_APP.profile.user.view.root}/${people.id}`);
  };

  return (
    <>
      <PeopleItemStyle direction="row">
        <Stack direction="row" sx={{ width: '100%' }} spacing={2} justifyContent="center" alignItems="center">
          <AvatarStyle
            onClick={() => {
              handleRouting();
            }}
            variant={varient === 'ngo' ? 'rounded' : 'circular'}
            src={people.avatarUrl || ''}
          />

          <Stack sx={{ width: 'calc(100% - 200px)' }} alignItems="flex-start">
            <Tooltip title={fullnameIsOverflow ? people.fullName : ''} enterTouchDelay={0}>
              <ClickableText
                onClick={() => handleRouting()}
                ref={fullnameRef}
                data-text={people.fullName}
                sx={{ width: '100%' }}
                variant="subtitle2"
                color="text.primary"
                noWrap
              >
                {people.fullName}
              </ClickableText>
            </Tooltip>
            <Tooltip title={headlineIsOverflow ? people.headline : ''} enterTouchDelay={0}>
              <ClickableText
                onClick={() => handleRouting()}
                ref={headlineRef}
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{ width: '100%' }}
              >
                {people.headline}
              </ClickableText>
            </Tooltip>
          </Stack>

          <ProfileButtonChecker
            fullName={people.fullName}
            itemId={people.id}
            itemType={FilterByEnum.Normal}
            meToOther={people.meToOtherStatus as any}
            otherToMe={people.otherToMeStatus as any}
          />
        </Stack>
      </PeopleItemStyle>
    </>
  );
};

export default PeopleItem;
