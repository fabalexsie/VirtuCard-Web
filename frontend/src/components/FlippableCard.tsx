import React, { forwardRef, useRef, useState } from 'react';
import './FlippableCard.scss';
import { motion } from 'framer-motion';
import { CardWrapper } from './Card';
import clsx from 'clsx';

export type FlipRefType = {
  openFrontPage: () => void;
  openBackPage: () => void;
};

const FlippableCard = forwardRef(
  (
    {
      front,
      back,
      onlyFirstPageAvailable = false,
    }: {
      front: React.ReactNode;
      back: React.ReactNode;
      onlyFirstPageAvailable?: boolean;
    },
    forwardRef: React.ForwardedRef<FlipRefType>,
  ) => {
    const [rotAnim, setRotAnim] = useState(0);
    const divPan = useRef<HTMLDivElement>(null);

    if (forwardRef != null) {
      (forwardRef as React.MutableRefObject<FlipRefType>).current = {
        openFrontPage: () => {
          setRotAnim(0);
        },
        openBackPage: () => {
          if (!onlyFirstPageAvailable) setRotAnim(-1);
        },
      };
    }

    const handlePan = (event: any, info: any) => {
      // "2 *" move the card twice as fast as the finger
      const relDelta = (2 * info.delta.x) / (divPan.current?.clientWidth || 1);
      setRotAnim(rotAnim + relDelta);
    };
    const handlePanEnd = (event: any, info: any) => {
      const relOffset = info.offset.x / (divPan.current?.clientWidth || 1);
      if (info.velocity.x > 200 || (relOffset > 0.3 && rotAnim < -0.5)) {
        setRotAnim(0);
      } else if (
        info.velocity.x < -200 ||
        (relOffset < -0.3 && rotAnim > -0.5)
      ) {
        setRotAnim(onlyFirstPageAvailable ? 0 : -1);
      } else {
        if (rotAnim > -0.5) setRotAnim(0);
        else setRotAnim(onlyFirstPageAvailable ? 0 : -1);
      }
    };

    return (
      <motion.div
        className="w-full h-full"
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        ref={divPan}
      >
        <div className="w-full h-full flex items-center justify-center touch-pan-y select-none">
          <CardWrapper>
            <motion.div
              layout
              className="flipable-card"
              animate={{
                rotateY: onlyFirstPageAvailable
                  ? `${180 * Math.max(-0.1, Math.min(rotAnim, 0.1))}deg`
                  : `${180 * Math.max(-1.1, Math.min(rotAnim, 0.1))}deg`,
              }}
            >
              <div
                className={clsx('front', {
                  'pointer-events-none': rotAnim < 0,
                })}
              >
                {front}
              </div>
              <div
                className={clsx('back', {
                  'pointer-events-none': rotAnim > -1,
                })}
              >
                {back}
              </div>
            </motion.div>
          </CardWrapper>
        </div>
      </motion.div>
    );
  },
);

export default FlippableCard;
