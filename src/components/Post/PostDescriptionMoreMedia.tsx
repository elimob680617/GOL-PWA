import { Box, Button, Stack, Typography } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import { SURFACE } from 'src/theme/palette';

interface IPostDes {
  title?: string;
  description?: string;
  seeMore?: boolean;
}

const PostDesContainer = styled('div')(({ theme }) => ({
  padding: '0 1rem',
}));
const PostDesContent = styled(Typography)(({ theme }) => ({
  marginTop: 20,
}));
const PostDesSeeMore = styled('span')(({ theme }) => ({
  color: '#8798A1',
  cursor: 'pointer',
}));

const BoxWrapper = styled(Box)(({ theme }) => ({
  '& .anchor': {
    color: theme.palette.grey[800],
    textDecoration: 'none',
  },
}));

const SeeMore = styled('span')(({ theme }) => ({
  cursor: 'pointer',
  lineHeight: '1.5',
  color: theme.palette.surface.main,
  fontSize: '1rem',
}));

const PostDesMoreMedia: FC<IPostDes> = ({ title, description }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const pRef = useRef<HTMLSpanElement>(null);
  const [showSeeMore, setShowSeeMore] = useState<boolean>(false);
  const [showSeeLess, setShowSeeLess] = useState<boolean>(false);
  const [slicedDescription, setSlicedDescription] = useState('');

  useEffect(() => {
    const height = 140;
    console.log(pRef?.current?.offsetHeight)
    if (description.length >= height && pRef?.current?.offsetHeight >= 85) {
      setShowSeeMore(true);
      setSlicedDescription(description.slice(0, height));
    }
  }, [description]);

  return (
    <BoxWrapper ref={boxRef}>
      <Box sx={{ paddingRight: showSeeMore ? 2 : null, paddingLeft: showSeeMore ? 2 : null, position: 'relative' }}>
        <Stack sx={{ position: 'relative', height: '120px' }}>
          <Box sx={{ position: 'relative', height: 'auto' }}>
            <PostDesContent
              sx={{
                overflow: showSeeMore ? 'hidden' : ' scroll',
                height: showSeeMore ? '70px' : 'auto',
                maxHeight: '330px',
                minHeight: showSeeLess ? pRef?.current?.offsetHeight :'70px' ,
                backgroundColor: showSeeMore ? null : 'rgba(53, 71, 82, 0.64)',
                position: showSeeMore ? null : 'absolute',
                zIndex: 22,
                paddingRight: showSeeMore ? null : 2,
                paddingLeft: showSeeMore ? null : 2,
              }}
              variant="body1"
              dangerouslySetInnerHTML={{ __html: showSeeMore ? slicedDescription : description }}
              color={SURFACE.main}
            />
            {showSeeMore && (
              <SeeMore
                onClick={() => {
                  setShowSeeMore(false);
                  setShowSeeLess(true);
                }}
              >
                <Typography variant="button">...see more</Typography>
              </SeeMore>
            )}
            {showSeeLess && (
              <SeeMore
              onClick={() => {
                setShowSeeMore(true);
                setShowSeeLess(false);
              }}
                style={{
                  position: 'absolute',
                  top: pRef?.current?.offsetHeight+20,
                  zIndex: 100,
                  backgroundColor: 'rgba(53, 71, 82, 0.64)',
                  width: '100%',
                  height:'3rem',
                  display:'flex',
                  alignItems:'center'
                }}
              >
                <Typography variant="button" sx={{padding:2}}>See Less</Typography>{' '}
              </SeeMore>
            )}
          </Box>
          {/* <Typography
            variant="body1"
            color={SURFACE.main}
            sx={{
              height: showSeeMore ? '70px' : 'auto',
              minHeight: '70px',
              backgroundColor: showSeeMore ? null : 'rgba(53, 71, 82, 0.64)',
              position: showSeeMore ? null : 'absolute',
              zIndex: 22,
              paddingRight: showSeeMore ? null : 2,
              paddingLeft: showSeeMore ? null : 2,
            }}
          >
            {showSeeMore ? slicedDescription : description}{' '}
            {showSeeMore ? (
              <SeeMore onClick={() => setShowSeeMore(false)} style={{color:SURFACE.onSurfaceVariantL}}>...see more</SeeMore>
            ) : (
              <SeeLess onClick={() => setShowSeeMore(true)}><Typography variant='button'>See Less</Typography> </SeeLess>
            )}
          </Typography> */}
        </Stack>

        <PostDesContent
          sx={{ visibility: 'hidden', position: 'absolute', zIndex: 0, top: 0 }}
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

export default PostDesMoreMedia;
