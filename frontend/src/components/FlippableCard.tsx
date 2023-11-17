import React, { forwardRef, useRef, useState } from 'react';
import './FlippableCard.scss';
import { motion } from 'framer-motion';

export type FlipRefType = {
  openFrontPage: () => void;
};

const FlippableCard = forwardRef(
  (
    {
      children,
      onlyFirstPageAvailable = false,
    }: {
      children: React.ReactNode;
      onlyFirstPageAvailable?: boolean;
    },
    forwardRef: React.ForwardedRef<FlipRefType>,
  ) => {
    const [rotAnim, setRotAnim] = useState(0);
    const divPan = useRef<HTMLDivElement>(null);

    // fill ref with life
    if (forwardRef != null) {
      (forwardRef as React.MutableRefObject<FlipRefType>).current = {
        openFrontPage: () => {
          setRotAnim(0);
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
      <motion.div onPan={handlePan} onPanEnd={handlePanEnd} ref={divPan}>
        <div className="w-screen h-screen flex items-center justify-center touch-pan-y select-none">
          <div className="flipable-card-holder">
            <motion.div
              layout
              className="flipable-card"
              animate={{
                rotateY: onlyFirstPageAvailable
                  ? `${180 * Math.max(-0.1, Math.min(rotAnim, 0.1))}deg`
                  : `${180 * Math.max(-1.1, Math.min(rotAnim, 0.1))}deg`,
              }}
              style={{ width: '100%', height: '100%' }}
            >
              {children}
            </motion.div>
          </div>
          {/*<Button
            onPress={() =>
              downloadVcf({
                firstname: 'Erika',
                emailList: ['erika@example.com'],
                phoneList: [{ no: '+49123456789', type: 'home' }],
              })
            }
          >
            Test
          </Button>
          <EjsRenderer
            template="Hello <%= name %><% if (from) { %> from <%= from %><% } %>!"
            data={{ name: 'World', from: undefined }}
          />*/}
        </div>
      </motion.div>
    );
  },
);

export default FlippableCard;
