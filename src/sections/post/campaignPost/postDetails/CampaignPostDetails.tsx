import { useEffect, useState } from 'react';
// @mui
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';

import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import { ArrowLeft, Happyemoji } from 'iconsax-react';
import { useRouter } from 'next/router';
import ReactHtmlParser from 'react-html-parser';
import { PostActions, PostCommets } from 'src/components/Post';
import { useLazyGetFundRaisingPostQuery } from 'src/_requests/graphql/post/post-details/queries/getFundRaisingPost.generated';
import DonorsList from './DonorsList';
import PostDetailsDonationDetails from './PostDetailsDonationDetails';
import PostDetailsHeader from './PostDetailsHeader';
import PostDetailsNgoInfo from './PostDetailsNgoInfo';

const CardStyle = styled(Card)(({ theme }) => ({
  borderRadius: 0,
  margin: 'auto',
  boxShadow: 'unset',
  width: '100%',
}));

const CardContentStyle = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  width: '100%',
}));
const StackContentStyle = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const StarRateWrapper = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.neutral,
  padding: 16,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 32,
  marginBottom: 32,
  borderRadius: 8,
  textAlign: 'center',
}));
const TabStyle = styled(Tab)<ITabInterface>(({ theme, active }) => ({
  color: active ? `${theme.palette.primary.main}!important` : `${theme.palette.text.secondary}!important`,
}));
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

interface ITabInterface {
  active: boolean;
}
function CampaignPostDetails() {
  const { back, query } = useRouter();
  const [value, setValue] = useState<number | null>(0);
  const theme = useTheme();
  const [getFundRaisingPost, { data: campaignPostData, isFetching: getFundRaisingPostFetching }] =
    useLazyGetFundRaisingPostQuery();
  const campaignPost = campaignPostData?.getFundRaisingPost?.listDto?.items?.[0];
  const [tabValue, setTabValue] = useState(0);
  const [commentOpen, setCommentOpen] = useState<boolean>(true);
  const [isLike, setIsLike] = useState(campaignPost?.isLikedByUser);
  const [countLike, setCountLike] = useState(Number(campaignPost?.countOfLikes));
  const [commentsCount, setCommentsCount] = useState<string | null | undefined>('0');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    setCommentsCount(campaignPostData?.getFundRaisingPost?.listDto?.items?.[0]?.countOfComments);
  }, [campaignPostData]);

  useEffect(() => {
    if (query?.id) getFundRaisingPost({ filter: { dto: { id: query.id[0] as string } } });
  }, [getFundRaisingPost, query]);

  useEffect(() => {
    setIsLike(campaignPost?.isLikedByUser);
  }, [campaignPost?.isLikedByUser]);
  useEffect(() => {
    setCountLike(Number(campaignPost?.countOfLikes));
  }, [campaignPost?.countOfLikes]);

  return (
    <>
      <Stack direction={'row'} alignItems={'center'} sx={{ p: 2 }}>
        <IconButton onClick={() => back()} sx={{ padding: 0 }}>
          <ArrowLeft />
        </IconButton>
        <Typography sx={{ ml: 2.5 }} variant="subtitle1">
          Details
        </Typography>
      </Stack>

      <Stack>
        <CardStyle>
          <CardMedia
            component="img"
            alt="Cover Image"
            height={'176px'}
            image={campaignPost?.coverImageUrl || '/icons/empty_cover.svg'}
          />
          <CardContentStyle>
            <StackContentStyle>
              <Box sx={{ mt: 2 }}>
                <PostDetailsHeader title={campaignPost?.title} />
              </Box>
              <Box sx={{ mt: 3 }}>
                <PostDetailsNgoInfo
                  fullName={campaignPost?.fullName}
                  avatar={campaignPost?.userAvatarUrl || undefined}
                  location={campaignPost?.placeDescription}
                  createdDateTime={campaignPost?.createdDateTime}
                  userType={campaignPost?.userType}
                  ownerUserId={campaignPost?.ownerUserId}
                  isMine={campaignPost?.isMine}
                />
              </Box>
              <Box sx={{ mx: -2, mt: 3 }}>
                <PostDetailsDonationDetails
                  dayleft={campaignPost?.dayLeft}
                  numberOfDonations={campaignPost?.numberOfDonations}
                  averageRate={campaignPost?.averageRate}
                  numberOfRates={campaignPost?.numberOfRates}
                  raisedMoney={campaignPost?.raisedMoney}
                  target={campaignPost?.target}
                  donors={campaignPost?.donors}
                />
              </Box>

              <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
                <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
                  <TabStyle active={tabValue === 0} label="About" {...a11yProps(0)} />
                  <TabStyle active={tabValue === 1} label="Donors" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <TabPanel value={tabValue} index={0}>
                <Typography>{ReactHtmlParser(campaignPost?.body || '')}</Typography>
                {value > 0 ? (
                  <StarRateWrapper sx={{ mt: 3, mb: 3 }}>
                    <IconButton>
                      <Happyemoji size="20" color={theme.palette.primary.main} />
                    </IconButton>

                    <Typography variant="subtitle2" color={theme.palette.text.primary} sx={{ mb: 1 }}>
                      Thank you for your rating!
                    </Typography>
                    <Typography variant="body2" color={theme.palette.text.secondary} sx={{ mb: 1 }}>
                      Let us know more about your rating with a comment down below
                    </Typography>
                  </StarRateWrapper>
                ) : (
                  <StarRateWrapper sx={{ mt: 3, mb: 3 }}>
                    <Typography variant="subtitle2" color={theme.palette.text.primary} sx={{ mb: 1 }}>
                      How was this campaign?
                    </Typography>
                    <Rating
                      name="simple-controlled"
                      value={value}
                      onChange={(event, newValue) => {
                        setValue(newValue);
                      }}
                    />
                  </StarRateWrapper>
                )}
                <Box sx={{ mx: -2 }}>
                  <Divider />
                  <Stack sx={{ p: 2 }}>
                    <PostActions
                      inDetails={true}
                      like={countLike}
                      countLikeChanged={setCountLike}
                      comment={campaignPost?.countOfComments || '0'}
                      share={campaignPost?.countOfShared || '0'}
                      view={campaignPost?.countOfViews || '0'}
                      id={campaignPost?.id}
                      isLikedByUser={isLike}
                      likeChanged={setIsLike}
                      setCommentOpen={setCommentOpen}
                      commentOpen={commentOpen}
                      postType="campaign"
                      sharedSocialPost={null}
                      sharedCampaignPost={null}
                    />
                  </Stack>
                  <Divider />
                  {!commentOpen ? (
                    <PostCommets
                      PostId={campaignPost?.id as string}
                      countOfComments={campaignPost?.countOfComments || '0'}
                      postType="campaign"
                      commentsCount={commentsCount}
                      setCommentsCount={setCommentsCount}
                    />
                  ) : null}
                </Box>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <DonorsList donors={campaignPost?.donors} />
              </TabPanel>
            </StackContentStyle>
          </CardContentStyle>
        </CardStyle>
      </Stack>
    </>
  );
}

export default CampaignPostDetails;
