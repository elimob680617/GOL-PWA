import { Avatar, AvatarGroup, Box, Grid, Link, Stack, Typography, Divider, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { initialState, valuingAll } from 'src/redux/slices/post/createSocialPost';
import { PostActions, PostCard, PostCommets, PostCounter, PostDescription, PostTitle } from 'src/components/Post';
import { useDispatch } from 'src/redux/store';
import { useRouter } from 'next/router';
import { PATH_APP } from 'src/routes/paths';
import SimpleVideo from 'src/components/video/SimpleVideo';
import ReactDOMServer from 'react-dom/server';
import { PRIMARY, SURFACE } from 'src/theme/palette';
import { jsx } from 'slate-hyperscript';
import moreMediaIcon from 'public/icons/moreMedia/24/Outline.svg';
import Image from 'next/image';
import { UserTypeEnum } from 'src/@types/sections/serverTypes';

interface IImageStyleProps {
  limitHeight: boolean;
}

const ImgStyle = styled('img')<IImageStyleProps>(({ theme, limitHeight }) => ({
  maxHeight: '30rem',
  maxWidth: '100%',
  height: 'auto',
}));

const MediaPostCounter = styled('div')(({ theme }) => ({
  padding: '0.5rem',
  paddingLeft: '1rem',
  color: theme.palette.primary.main,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: theme.palette.primary.lighter,
  },
}));

const MoreImg = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: '0.5rem',
}));

interface IPostCardInterface {
  post: any;
}

type PostMediaType = 'video' | 'img';
interface IPostMedia {
  link: string;
  type: PostMediaType;
  thumbnail?: string;
}

function SocialPost(props: IPostCardInterface) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [commentOpen, setCommentOpen] = useState<boolean>(true);
  const [postCounter, setPostCounter] = useState([
    {
      id: 1,
      name: 'Remy Sharp',
      image: 'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fuser.02b413c5.jpg&w=1920&q=75',
    },
    {
      id: 2,
      name: 'Travis Howard',
      image: 'https://mui.com/static/images/avatar/1.jpg',
    },
    {
      id: 3,
      name: 'Cindy Baker',
      image: 'https://mui.com/static/images/avatar/2.jpg',
    },
    {
      id: 4,
      name: 'Agnes Walker',
      image: 'https://mui.com/static/images/avatar/3.jpg',
    },
  ]);
  const { post } = props;
  const { push } = useRouter();
  const [body, setBody] = useState<string>('');
  const [media, setMedia] = useState<IPostMedia[]>([]);

  const editBody = [];

  const handleTextBodyEdit = () => {
    let editText = post.body;
    let mentionIndex = -1;
    let tagIndex = -1;
    let element: any = [];
    let children = [];
    let bodyText = '';
    let editTextIndex = 0;

    if (editText.length === 0) {
      children = initialState.text;
    }

    while (editText.length > 0) {
      if (editText[editTextIndex] !== '╣' && editText[editTextIndex] !== '#' && editText[editTextIndex] !== '\\') {
        bodyText += editText[editTextIndex];
        editTextIndex++;
        if (editText[editTextIndex] === null || editText[editTextIndex] === undefined) {
          editText = '';
          editTextIndex = 0;
          element.push({ text: bodyText });
          bodyText = '';
          children.push({ type: 'paragraph', children: element });
          break;
        }
      } else {
        editText = editText.substr(editTextIndex);
        editTextIndex = 0;
        element.push({ text: bodyText });
        bodyText = '';
        if (editText[editTextIndex] === '╣') {
          const mention = editText.match(/╣(.*?)╠/)[0];
          mentionIndex++;
          const mentionedValue = mention.replace('╣', '').replace('╠', '');
          element.push(
            jsx(
              'element',
              {
                type: 'mention',
                username: mentionedValue,
                fullname: mentionedValue,
                class: 'inserted-mention',
              },
              [{ text: '' }]
            )
          );
          element.push({ text: '' });
          editText = editText.replace(/╣(.*?)╠/, '');
        } else if (editText[editTextIndex] === '#') {
          const tag = editText.match(/#(.*?)\s/)[0];
          tagIndex++;
          const tagedValue = tag.replace('#', '');
          element.push(jsx('element', { type: 'tag', class: 'inserted-tag', title: tagedValue }, [{ text: '' }]));
          element.push({ text: '' });
          editText = editText.replace(/#(.*?)\s/, '');
        } else if (editText[editTextIndex] === '\\') {
          editText = editText.substr(2);
          children.push({ type: 'paragraph', children: element });
          element = [{ text: '' }];
        }
      }

      if (editText === '') {
        children.push({ type: 'paragraph', children: element });
      }
    }

    return children;
  };

  const setEditingValue = () => {
    push(PATH_APP.post.createPost.socialPost.index);
    dispatch(
      valuingAll({
        audience: post.audience,
        gifs: '',
        location: {
          address: post.placeDescription,
          id: post.placeId,
          name: post.placeMainText,
          variant: 'company',
          secondaryText: post.placeSecondaryText,
        },
        // picturesUrls: post.pictureUrls.map((picture: string) => ({ altImage: '', isDefault: false, url: picture })),
        text: handleTextBodyEdit(),
        // videoUrls: post.videoUrls.map((video: string) => ({ url: video, isDefault: false })),
        mediaUrls: post.mediaUrls,
        currentPosition: [],
        editMode: true,
        id: post.id,
        fileWithError: '',
      })
    );
  };

  const MentionElementCreator = (fullname: string, username: string, id: string) => (
    <Link href="">
      <Typography
        variant="subtitle1"
        color={PRIMARY.main}
        className="inserted-mention"
        id={id}
        sx={{
          padding: '0!important',
          verticalAlign: 'baseline',
          display: 'inline-block',
          lineHeight: '0',
        }}
      >
        {fullname}
      </Typography>
    </Link>
  );

  const TagElementCreator = (tag: string) => (
    <Link href="">
      <Typography
        variant="subtitle1"
        color={PRIMARY.main}
        className="inserted-tag"
        sx={{
          verticalAlign: 'baseline',
          display: 'inline-block',
          padding: '0!important',
          lineHeight: '0',
        }}
      >
        {tag}
      </Typography>
    </Link>
  );

  const BrElementCreator = () => <br />;

  const setGridFlex = (type: PostMediaType, index: number) => {
    const beforeFullWidth = media[index - 1] && media[index - 1].type === 'video' ? true : false;
    const nextFullWidth = media[index + 1] && media[index + 1].type === 'video' ? true : false;

    if (type === 'img') {
      if (beforeFullWidth || nextFullWidth) {
        if ((index + 1) % 2 !== 0) {
          return 12;
        } else {
          return 6;
        }
      } else {
        if (media.length > index + 1) {
          return 6;
        } else {
          if ((index + 1) % 2 !== 0) {
            return 12;
          } else {
            return 6;
          }
        }
      }
    } else if (type === 'video') {
      return 12;
    }
  };

  const valuingMedia = () => {
    const newMedia: IPostMedia[] = [];
    // post.pictureUrls.forEach((picture) => {
    //   newMedia.push({ link: picture, type: 'img' });
    // });

    // post.videoUrls.forEach((video) => {
    //   newMedia.push({ link: video, type: 'video', thumbnail: '' });
    // });
    post.mediaUrls?.forEach((value) => {
      newMedia.push({ link: value.url, type: value.isVideo ? 'video' : 'img' });
    });
    setMedia([...newMedia]);
  };
  useEffect(() => {
    if (!post) return;
    let body = post.body;
    const mentions = body.match(/╣(.*?)╠/g) || [];
    const tags = body.match(/#(.*?)\s/g) || [];
    const newLines = body.match(/[\\\/]/g) || [];

    body = body.replace(/\\n/g, ReactDOMServer.renderToStaticMarkup(BrElementCreator()));

    mentions.forEach((mention) => {
      const mentionedValue = mention.replace('╣', '').replace('╠', '');
      body = body.replace(
        mention,
        ReactDOMServer.renderToStaticMarkup(MentionElementCreator(mentionedValue, mentionedValue, mentionedValue))
      );
    });

    tags.forEach((tag) => {
      body = body.replace(new RegExp(tag, 'g'), ReactDOMServer.renderToStaticMarkup(TagElementCreator(tag)));
    });

    setBody(body);
    valuingMedia();
  }, [post]);

  const [countLike, setCountLike] = useState(post?.countOfLikes);
  const [isLike, setIsLike] = useState(post?.isLikedByUser);
  useEffect(() => {
    setIsLike(post?.isLikedByUser);
  }, [post?.isLikedByUser]);

  useEffect(() => {
    setCountLike(post?.countOfLikes);
  }, [post?.countOfLikes]);
  
  return (
    <PostCard>
      <PostTitle
        editCallback={() => {
          setEditingValue();
        }}
        avatar={
          <Avatar
            sx={{ height: 48, width: 48 }}
            aria-label="recipe"
            src={post?.userAvatarUrl || ''}
            variant={post?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'}
          />
        }
        username={post?.fullName ? post?.fullName : `${post?.firstName} ${post?.lastName}`}
        Date={post?.createdDateTime || ''}
        PostNo={'simple'}
        location={post?.placeDescription || ''}
        isMine={post?.isMine}
        userId={post?.ownerUserId}
        userType={post?.userType}
        postId={post?.id}
      />
      <Box sx={{ paddingTop: 2 }} />
      <PostDescription description={body || ''} />
      <Box sx={{ paddingTop: 2 }} />
      {media.length !== 0 && (
        <Grid
          container
          spacing={0.5}
          sx={{
            backgroundColor: SURFACE.onSurface,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: '100%',
            height: '30rem',
          }}
          // onClick={() => push({ pathname: PATH_APP.post.moreMedia, query: { post: post?.id } })}
        >
          {/* {videos.length ? (
          <Box sx={{ paddingLeft: 0.5 }}>
          <SimpleVideo controls key={post?.videoUrls[0]} autoShow src={videos[0]?.link} />
        </Box>
        ) : (
          media[0]?.type === 'img' && (
            <ImgStyle
              limitHeight={setGridFlex(media[0]?.type, 1) === 6 ? true : false}
              key={media[0]?.link}
              src={
                media[0]?.link.indexOf('http') >= 0 || media[0]?.link.indexOf('https') >= 0
                  ? media[0]?.link
                  : `http://${media[0]?.link}`
              }
            />
          )
        )} */}
          {media && media.findIndex((i) => i.type === 'video') >= 0 && (
            <Box sx={{ paddingLeft: 0.5 }}>
              <SimpleVideo
                controls
                key={media.find((i) => i.type === 'video').link}
                autoShow
                src={media.find((i) => i.type === 'video').link}
              />
            </Box>
          )}
          {media && media.findIndex((i) => i.type === 'video') < 0 && media[0] && (
            <ImgStyle
              limitHeight={setGridFlex('img', 1) === 6 ? true : false}
              key={media[0].link}
              src={
                media[0].link.indexOf('http') >= 0 || media[0].link.indexOf('https') >= 0
                  ? media[0].link
                  : `http://${media[0].link}`
              }
            />
          )}
        </Grid>
      )}
      {media.length >= 2 ? (
        <MediaPostCounter onClick={() => push({ pathname: PATH_APP.post.moreMedia, query: { post: post?.id } })}>
          <MoreImg>
            <Image src={moreMediaIcon} alt="more media" />
          </MoreImg>
          <Typography>+{media.length - 1} more media</Typography>
        </MediaPostCounter>
      ) : null}

      {/* <MediaPostCounter>123</MediaPostCounter> */}
      <Stack direction={'row'} sx={{ p: 2 }}>
      {post?.postLikerUsers.length !== 0 ? (
            <Stack direction={'row'} sx={{ p: 2 }} alignItems="center">
              <PostCounter
                type={true} //Like & comments Counter
                counter={countLike}
                lastpersonName={post?.postLikerUsers}
                lastpersonsData={post?.postLikerUsers}
                Comments={post?.countOfComments || '0'}
              />
            </Stack>
          ) : null}
      </Stack>

      <Divider />
      <Stack sx={{ p: 2 }}>
        <PostActions
          inDetails={false}
          like={countLike}
          countLikeChanged={setCountLike}
          comment={post?.countOfComments || '0'}
          share={post?.countOfShared || '0'}
          view={post?.countOfViews || '0'}
          id={post?.id}
          postType="social"
          setCommentOpen={setCommentOpen}
          commentOpen={commentOpen}
          isLikedByUser={isLike}
          likeChanged={setIsLike}
          sharedSocialPost={post?.sharedSocialPost}
          sharedCampaignPost={post?.sharedCampaignPost}
        />
      </Stack>
      {!commentOpen ? <PostCommets PostId={post?.id} countOfComments={post?.countOfComments || '0'} postType='social'/> : null}
    </PostCard>
  );
}

export default SocialPost;
