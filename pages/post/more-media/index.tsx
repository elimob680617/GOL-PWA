import { IconButton, Typography, Avatar, Box, useTheme, Stack } from '@mui/material';
import Image from 'next/image';
import { useRouter, withRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PostTitleMoreMedia, PostDescriptionMoreMedia, PostCounter, PostActions } from 'src/components/Post';
import { useLazyGetSocialPostQuery } from 'src/_requests/graphql/post/getSocialPost.generated';
import ReactDOMServer from 'react-dom/server';
import Link from 'next/link';
import { PRIMARY, SURFACE } from 'src/theme/palette';
import { initialState, valuingAll } from 'src/redux/slices/post/createSocialPost';
import { jsx } from 'slate-hyperscript';
import { PATH_APP } from 'src/routes/paths';
import { dispatch } from 'src/redux/store';
import { styled } from '@mui/material/styles';
import SimpleVideo from 'src/components/video/SimpleVideo';
import { useSwipeable } from 'react-swipeable';
import cameraIcon from 'public/icons/camera/24/Outline.svg';

type PostMediaType = 'video' | 'img';

interface IPostMedia {
  link: string;
  type: PostMediaType;
  thumbnail?: string;
}
interface IImageStyleProps {
  limitHeight: boolean;
}
const ImgStyle = styled('img')<IImageStyleProps>(({ theme, limitHeight }) => ({
  maxHeight: '100%',
  width: '100%',
  margin: 'auto',
  position: 'relative',
}));
const ActionArea = styled('div')(({ theme }) => ({
  padding: 15,
  height: 42,
  borderTop: `1px solid ${theme.palette.surface.onSurfaceVariant}`,
}));

function MediaDialog(props) {
  const { push } = useRouter();
  const [body, setBody] = useState<string>('');
  const theme = useTheme();

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
  const [media, setMedia] = useState<IPostMedia[]>([]);
  const [getSocialPost, { isLoading: getSocialPostLoading, data: socialPost }] = useLazyGetSocialPostQuery();
  const [post, setPost] = useState([]);
  const [carousel, setCarousel] = useState<number>(1);

  const handleTextBodyEdit = () => {
    let editText = post[0]?.body;
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
          element = [];
        }
      }

      if (editText === '') {
        children.push({ type: 'paragraph', children: element });
      }
    }

    return children;
  };

  useEffect(() => {
    getSocialPost({ filter: { dto: { id: props.router.query.post } } })
      .unwrap()
      .then((res) => {
        const postData = [];
        postData.push(res.getSocialPost.listDto.items[0]);
        setPost(postData);
      });
  }, [props.router.query.post]);

  const valuingMedia = () => {
    const newMedia: IPostMedia[] = [];
    // post[0]?.pictureUrls.forEach((picture) => {
    //   newMedia.push({ link: picture, type: 'img' });
    // });

    // post[0]?.videoUrls.forEach((video) => {
    //   newMedia.push({ link: video, type: 'video', thumbnail: '' });
    // });
    post[0]?.mediaUrls?.forEach((value) => {
      newMedia.push({ link: value.url, type: value.isVideo ? 'video' : 'img' });
    });
    setMedia([...newMedia]);
  };
  const BrElementCreator = () => <br />;
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
  useEffect(() => {
    if (!post) return;
    let body = post[0]?.body;
    const mentions = body?.match(/╣(.*?)╠/g) || [];
    const tags = body?.match(/#(.*?)\s/g) || [];
    const newLines = body?.match(/[\\\/]/g) || [];

    body = body?.replace(/\\n/g, ReactDOMServer.renderToStaticMarkup(BrElementCreator()));

    mentions.forEach((mention) => {
      const mentionedValue = mention.replace('╣', '').replace('╠', '');
      body = body?.replace(
        mention,
        ReactDOMServer.renderToStaticMarkup(MentionElementCreator(mentionedValue, mentionedValue, mentionedValue))
      );
    });

    tags.forEach((tag) => {
      body = body?.replace(new RegExp(tag, 'g'), ReactDOMServer.renderToStaticMarkup(TagElementCreator(tag)));
    });

    setBody(body);
    valuingMedia();
  }, [post]);

  const { back } = useRouter();
  const [isLike, setIsLike] = useState(post[0]?.isLikedByUser);
  useEffect(() => {
    setIsLike(post[0]?.isLikedByUser);
  }, [post[0]?.isLikedByUser]);
  
  const handlers = useSwipeable({
    onSwipedLeft: () => (carousel === media.length ? setCarousel(media.length) : setCarousel(carousel + 1)),
    onSwipedRight: () => (carousel === 1 ? setCarousel(1) : setCarousel(carousel - 1)),
  });
  return (
    <Box
      sx={{
        bgcolor: SURFACE.onSurface,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
      }}
    >
      <Box sx={{ color: SURFACE.main, width: '100%', display: 'flex', alignItems: 'center', marginBottom: 1 }}>
        <IconButton onClick={() => back()}>
          <Image src="/icons/arrow/left-arrow.svg" width={30} height={30} alt="Back-button" />
        </IconButton>
        <Typography variant="subtitle1">{`${carousel} of ${media.length}`}</Typography>
      </Box>
      <Box>
        <PostTitleMoreMedia
          avatar={
            <Avatar
              sx={{ height: 48, width: 48 }}
              aria-label="recipe"
              src={post[0]?.userAvatarUrl || ''}
              alt="Hanna Baldin"
            />
          }
          username={post[0]?.firstName && post[0].lastName ? `${post[0]?.fullName}` : ''}
          PostNo={'simple'}
          Date={post[0]?.createdDateTime || ''}
        />
      </Box>
      <Box>
        <PostDescriptionMoreMedia description={body || ''} seeMore={true} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
        <Box {...handlers} sx={{ maxHeight: 550, marginTop: 0, background: SURFACE.onSurface, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', position: 'relative' }}>
            {media[carousel - 1]?.type === 'img' ? (
              <ImgStyle
                limitHeight={true}
                key={media[carousel - 1]?.link}
                src={
                  media[carousel - 1]?.link.indexOf('http') >= 0 || media[carousel - 1]?.link.indexOf('https') >= 0
                    ? media[carousel - 1]?.link
                    : `http://${media[carousel - 1]?.link}`
                }
              />
            ) : media[carousel - 1]?.type === 'video' ? (
              <Box sx={{ position: 'relative' }}>
                <SimpleVideo autoShow controls src={media[carousel - 1]?.link} />
              </Box>
            ) : null}
          </Box>
        </Box>
      </Box>
      <Box>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {media.map((item, index) => (
              <Box
                sx={
                  carousel - 1 === index
                    ? {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: 'black',
                        marginLeft: 1,
                        marginRight: 1,
                        cursor: 'pointer',
                        border: `1px solid ${SURFACE.main}`,
                        borderRadius: '8px',
                      }
                    : {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: 'black',
                        marginLeft: 1,
                        marginRight: 1,
                        cursor: 'pointer',
                      }
                }
                key={index}
                onClick={() => setCarousel(index + 1)}
              >
                {item.type === 'img' ? (
                  <Image
                    src={item.link}
                    height={carousel - 1 === index ? 72 : 56}
                    width={carousel - 1 === index ? 72 : 56}
                    alt=""
                  />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: `${carousel - 1 === index ? 72 : 56}`,
                      height: `${carousel - 1 === index ? 72 : 56}`,
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        color: SURFACE.main,
                        position: 'absolute',
                        fontSize: '8px',
                        bottom: '0.2rem',
                        left: '0.2rem',
                      }}
                    >
                      <Image src={cameraIcon} alt="camera" /> 02:10
                    </Box>
                    <SimpleVideo
                      width={carousel - 1 === index ? 72 : 56}
                      height={carousel - 1 === index ? 72 : 56}
                      src={item.link}
                    />
                  </Box>
                )}
              </Box>
            ))}
        </Box>
      </Box>
      <Stack direction={'row'} sx={{ p: 2 }} justifyContent={'center'} alignItems={'center'}>
        <PostCounter type={true} counter={109} lastpersonName={'Davood Malekia'} lastpersonsData={postCounter} />
        <Typography variant="caption" color={theme.palette.text.secondary} sx={{ ml: 0.5 }}>
          Davood Malekia and 13.2k others liked this post.
        </Typography>
      </Stack>
      <ActionArea>
        <PostActions
          like={post[0]?.countOfLikes || ''}
          comment={post[0]?.countOfComments || ''}
          share={post[0]?.countOfShared || ''}
          view={post[0]?.countOfViews || ''}
          id={post[0]?.id}
          isLikedByUser={isLike}
          likeChanged={setIsLike}
        />
      </ActionArea>
    </Box>
  );
}

export default withRouter(MediaDialog);
function push(index: any) {
  throw new Error('Function not implemented.');
}
