import { useMediaQuery } from '@custom-react-hooks/all';

const useMobile = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return isMobile
};

export default useMobile;