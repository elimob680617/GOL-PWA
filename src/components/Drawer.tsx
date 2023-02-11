import { styled } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import { Transition, animated, useSpring } from 'react-spring';
import { DialogOverlay, DialogContent } from '@reach/dialog';

interface ISliderProps {
  open: boolean;
  onDismiss: () => void;
}

function useDelayClose(open) {
  const [delayClose, setDelayClose] = useState(false);
  const [everOpen, setEverOpen] = useState(false);
  useEffect(() => {
    if (!open) {
      setDelayClose(true);
      const timeout = setTimeout(() => {
        setDelayClose(false);
      }, 600);
      return () => clearTimeout(timeout);
    } else {
      setEverOpen(true);
      setDelayClose(true);
    }
  }, [open]);
  return delayClose && everOpen;
}

const Drawer: FC<ISliderProps> = (props) => {
  const { open, onDismiss } = props;
  const { left } = useSpring({ left: open ? 0 : -300 });
  const delayClose = useDelayClose(open);

  return (
    <DialogOverlay isOpen={props.open || delayClose} onDismiss={onDismiss} style={{zIndex: 999}}>
      <DialogContent
        style={{
          width: 0,
          height: 0,
          padding: 0,
          margin: 0,
        }}
      >
        <animated.div
          style={{
            position: 'fixed',
            width: 300,
            maxWidth:'90%',
            top: 0,
            left: left,
            bottom: 0,
            padding: 0,
            margin: 0,
            backgroundColor: 'white',
          }}
        >
          {props.children}
        </animated.div>
      </DialogContent>
    </DialogOverlay>
  );
};

export default Drawer;
