import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { Container } from '@mui/material';

import TeamForm from './TeamForm';
import ViewTeam from './view/ViewTeam';

import Page from '../../../../components/Page';

import useSettings from '../../../../hooks/useSettings';
import { getTeamApi } from '../../../../apis/admin/team/TeamApis'; // Adjusted API import
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';

export default function TeamOperation() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { id = '' } = useParams();
  const isEdit = pathname.includes('edit');
  const isView = pathname.includes('view');
  const [data, setData] = useState({});

  let name;
  let heading;
  const mainTitle = 'Teams'; // Adjusted mainTitle
  const title = 'Team'; // Adjusted title

  if (isEdit) {
    name = 'Update';
    heading = `Update ${title}`;
  } else if (isView) {
    name = 'View';
    heading = `View ${title}`;
  } else {
    name = 'Create';
    heading = `Create ${title}`;
  }

  const getTeam = (teamId) => { // Adjusted function name and parameter
    if (isEdit || isView) {
      getTeamApi({ team_id: teamId }) // Adjusted API function and parameter
        .then((res) => {
          setData(res?.data?.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  useEffect(() => {
    getTeam(id); // Adjusted function call
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Page title={`${name} ${title}`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={heading}
          links={[
            { name: 'Dashboard', href: '/admin/dashboard' },
            { name: `${mainTitle}`, href: '/admin/teams' },
            { name: `${name} ${title}` },
          ]}
        />

        {isView ? (
          <ViewTeam details={data} />
        ) : (
          <TeamForm isEdit={isEdit} data={data} />
        )}
      </Container>
    </Page>
  );
}
