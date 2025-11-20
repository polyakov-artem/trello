import type { FC } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { getScrollbarWidth } from '@/shared/lib/sizeUtils';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { createPortal } from 'react-dom';

interface ModalProps {
  closeModal: () => void;
  isOpen: boolean;
  title?: string;
  body?: React.ReactNode;
  buttons?: React.ReactNode;
  onCloseComplete?: () => void;
}

const lockBody = () => {
  const scrollbarWidth = getScrollbarWidth();
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollbarWidth}px`;
};

const unlockBody = () => {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
};

const overlayInitialState = {
  autoAlpha: 0,
  duration: 0.2,
};

const overlayOpenState = {
  autoAlpha: 1,
};

const modalInitialState = {
  autoAlpha: 0,
  duration: 0.1,
  y: 40,
  scale: 0.8,
};

const modalOpenState = {
  autoAlpha: 1,
  y: 0,
  scale: 1,
};

const modalsContainer = document.getElementById('modals')!;

const Modal: FC<ModalProps> = ({ closeModal, isOpen, title, body, buttons, onCloseComplete }) => {
  const [mainTl] = useState(gsap.timeline());
  const [hasDom, setHasDom] = useState(isOpen);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHasDom(true);
    }
  }, [isOpen]);

  useEffect(() => {
    return unlockBody;
  }, []);

  const cancelPrevAnimation = useCallback(() => {
    const recent = mainTl.recent();

    if (recent instanceof gsap.core.Timeline) {
      recent.eventCallback('onComplete', null);
      recent.kill();
      mainTl.clear();
    }
  }, [mainTl]);

  useGSAP(() => {
    if (!modalRef.current || !overlayRef.current) return;

    if (!isOpen) {
      cancelPrevAnimation();

      const disappearingAnimation = gsap.timeline({
        onComplete: () => {
          setHasDom(false);
          unlockBody();
          onCloseComplete?.();
        },
      });

      disappearingAnimation
        .to(overlayRef.current, overlayInitialState)
        .to(modalRef.current, modalInitialState, '<');

      mainTl.add(disappearingAnimation);
    }
  }, [isOpen]);

  useGSAP(() => {
    if (!modalRef.current || !overlayRef.current) return;

    if (hasDom) {
      lockBody();
      cancelPrevAnimation();

      const appearingAnimation = gsap.timeline();
      appearingAnimation
        .fromTo(overlayRef.current, overlayInitialState, overlayOpenState)
        .fromTo(modalRef.current, modalInitialState, modalOpenState, '<');

      mainTl.add(appearingAnimation);
    }
  }, [hasDom]);

  if (!hasDom) return null;

  return (
    <>
      {createPortal(
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-10 "
          onClick={(e) => {
            if (e.target === overlayRef.current) {
              closeModal();
            }
          }}>
          <div
            ref={modalRef}
            className="relative max-h-[90vh] w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className=" p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <Button
                variant="text"
                color="default"
                onClick={closeModal}
                shape="circle"
                icon={<CloseOutlined />}
              />
            </div>
            <div className="p-4 border-t border-gray-200">{body}</div>
            {buttons && <div className="p-4 flex items-center gap-4 justify-center">{buttons}</div>}
          </div>
        </div>,
        modalsContainer
      )}
    </>
  );
};

export default Modal;
