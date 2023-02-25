import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { domainName } = useParams();
  const [searchQuery] = useSearchParams();

  console.log('domainName', searchQuery.get('domainName'));
  const domainNamePrefered = searchQuery.get('domainName') || domainName;

  useEffect(() => {
    if (domainNamePrefered === undefined) {
      navigate('/', { replace: true });
      return;
    }
    let tmp = domainNamePrefered;
    if (tmp.at(-1) === '/') {
      tmp = tmp.substring(0, tmp.length - 1);
    }
    if (tmp.indexOf('web+newpod://') === 0) {
      navigate(`/manage/${tmp.substring(13)}/record`, { replace: true });
      return;
    }
    navigate(`/manage/${tmp}/record`, { replace: true });
  }, []);
  return null;
};

export default Index;
