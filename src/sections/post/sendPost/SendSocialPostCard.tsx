import { Box, Link, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { PostDescription } from 'src/components/Post';
import { PRIMARY } from 'src/theme/palette';

const ImgStyle = styled('img')(({ theme }) => ({
  display: 'block',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  objectFit: 'cover',
}));

const VideoStyle = styled('video')(({ theme }) => ({
  borderRadius: 8,
}));
interface IPostCardInterface {
  sentPost: any;
}
type PostMediaType = 'video' | 'img';
interface IPostMedia {
  link: string;
  type: PostMediaType;
  thumbnail?: string;
}
function SocialPostCard(props: IPostCardInterface) {
  const { sentPost } = props;
  const [body, setBody] = useState<string>('');
  const [media, setMedia] = useState<IPostMedia[]>([]);
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

  const valuingMediaPost = useCallback(() => {
    const newMedia: IPostMedia[] = [];
    // post.pictureUrls.forEach((picture) => {
    //   newMedia.push({ link: picture, type: 'img' });
    // });

    // post?.videoUrls?.forEach((video) => {
    //   newMedia.push({ link: video, type: 'video', thumbnail: '' });
    // });

    sentPost?.mediaUrls?.forEach((value) => {
      newMedia.push({ link: value.url, type: value.isVideo ? 'video' : 'img' });
    });

    setMedia([...newMedia]);
  }, [sentPost?.mediaUrls]);

  useEffect(() => {
    if (!sentPost) return;
    let body = sentPost?.body;
    const mentions = body?.match(/╣(.*?)╠/g) || [];
    const tags = body?.match(/#(.*?)\s/g) || [];

    body = body?.replace(/\\n/g, ReactDOMServer.renderToStaticMarkup(BrElementCreator()));

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
    valuingMediaPost();
  }, [sentPost, valuingMediaPost]);

  return (
    <>
      <Stack spacing={1} sx={{ bgcolor: 'background.neutral', borderRadius: 1 }}>
        <Stack direction={'row'} alignItems="center " spacing={1}>
          {media.length !== 0 && (
            <Stack>
              {media && media.findIndex((i) => i.type === 'video') >= 0 && (
                <Box>
                  <VideoStyle width={'64px'} height={'64px'}>
                    <source
                      key={media.find((i) => i.type === 'video')?.link}
                      src={media.find((i) => i.type === 'video')?.link}
                    />
                  </VideoStyle>
                </Box>
              )}
              {media && media.findIndex((i) => i.type === 'video') < 0 && media[0] && (
                <ImgStyle
                  // limitHeight={setGridFlex('img', 1) === 6 ? true : false}
                  key={media[0].link}
                  src={
                    media[0].link.indexOf('http') >= 0 || media[0].link.indexOf('https') >= 0
                      ? media[0].link
                      : `http://${media[0].link}`
                  }
                  width={'64px'}
                  height={'64px'}
                  sx={{ borderRadius: 1 }}
                />
              )}
            </Stack>
          )}
          <Stack  sx={{pb:1}}>
            <Stack sx={{ p: 1 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {sentPost?.firstName && sentPost?.lastName
                  ? `${sentPost?.firstName} ${sentPost?.lastName}`
                  : `${sentPost?.fullName}`}
              </Typography>
            </Stack>
            <PostDescription description={body || ''} isSent={true} />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}

export default SocialPostCard;
