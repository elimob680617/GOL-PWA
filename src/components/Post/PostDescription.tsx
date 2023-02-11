import { Box, Button, Stack, Typography } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { PATH_APP } from 'src/routes/paths';
import { GREY } from 'src/theme/palette';

interface IPostDes {
  title?: string;
  description?: string;
  PostNo?: boolean;
  id?: string;
  isSent?: boolean;
}

const PostDesContainer = styled('div')(({ theme }) => ({
  padding: '0 1rem',
}));
const PostDesContent = styled(Typography)(({ theme }) => ({}));
const PostDesSeeMore = styled('span')(({ theme }) => ({
  color: '#8798A1',
  cursor: 'pointer',
}));

const BoxWrapper = styled(Box)(({ theme }) => ({
  '& .anchor': {
    textDecoration: 'none',
  },
}));

const SeeMore = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  color: theme.palette.grey[800],
}));
const SentPostTitle = styled(Box)(({ theme }) => ({
  display: '-webkit-box',
  '-webkit-line-clamp': '1',
  '-webkit-box-orient': 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

const PostDes: FC<IPostDes> = ({ title, description, PostNo, id, isSent = false }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const pRef = useRef<HTMLSpanElement>(null);
  const [showSeeMore, setShowSeeMore] = useState<boolean>(false);
  const [slicedDescription, setSlicedDescription] = useState('');
  const { push } = useRouter();

  useEffect(() => {
    const height = 195;
    if (description.length >= height && pRef?.current?.offsetHeight >= 85) {
      setShowSeeMore(true);
      setSlicedDescription(description.slice(0, height));
    }
  }, [description]);

  return (
    <BoxWrapper ref={boxRef}>
      <Box sx={{ paddingRight: 2, paddingLeft: 2, position: 'relative' }}>
        {title && (
          <Box sx={{ paddingTop: 2 }}  onClick={() => push(`/post/campaign-post/post-details/${id}`)}>
            <Typography variant="subtitle1" fontWeight={'bold'}>{title}</Typography>
          </Box>
        )}
        {/* {boxRef.current && (
          <ShowMoreText
            width={boxRef.current.clientWidth - 32}
            lines={3}
            more="see more"
            expanded={false}
            truncatedEndingComponent="..."
            anchorClass="anchor"
            less=""
          > */}
        <Stack sx={{ position: 'relative' }}>
        {isSent ? (
            <SentPostTitle>
              <Typography
                variant="caption"
                dangerouslySetInnerHTML={{ __html: showSeeMore ? slicedDescription : description }}
                sx={{ color: 'text.secondary'}}
              />
            </SentPostTitle>
          ) : (
            <>
              <PostDesContent
                sx={{ overflow: 'hidden', height: 'auto', '& p': { marginBottom: 0 } }}
                variant="body1"
                dangerouslySetInnerHTML={{ __html: showSeeMore ? slicedDescription : description }}
              />
             {showSeeMore && (
            <SeeMore
              onClick={() =>
                !PostNo
                  ? setShowSeeMore(false)
                  : push(`/post/campaign-post/post-details/${id}`)
              }
            >
              <Typography variant='body1' color={GREY[500]}>                
              ...see more
              </Typography>
            </SeeMore>
          )}
            </>
          )}


        </Stack>

        <PostDesContent
          sx={{ visibility: 'hidden', position: 'absolute', zIndex: 0, top: 0, maxHeight: 200, overflow: 'hidden' }}
          ref={pRef}
          variant="body1"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        {/* </ShowMoreText> */}
        {/* )} */}
      </Box>
    </BoxWrapper>
  );
};

export default PostDes;
