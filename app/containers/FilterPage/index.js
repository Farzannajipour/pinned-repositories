/*
 * FilterPage
 *
 * List all the features
 */
import React from 'react';
import { Helmet } from 'react-helmet';

import H1 from 'components/H1';
import { ButtonGroup, Button } from 'reactstrap';
import List from './List';
import ListItem from './ListItem';
import ListItemTitle from './ListItemTitle';

export default function FilterPage() {
  return (
    <div>
      <Helmet>
        <title>Filter Component</title>
        <meta name="description" content="Filter Page" />
      </Helmet>
      <H1>Filter Component</H1>
      <List>
        <ListItem>
          <ListItemTitle>Inactive (type)</ListItemTitle>
          <ButtonGroup>
            <Button color="primary">Sources</Button>
            <Button color="primary">Forks</Button>
            <Button color="primary">Archived</Button>
            <Button color="primary">Mirrors</Button>
          </ButtonGroup>
        </ListItem>
        <ListItem>
          <ListItemTitle>Inactive (Language)</ListItemTitle>
          <ButtonGroup>
            <Button color="primary">English</Button>
            <Button color="primary">German</Button>
            <Button color="primary">Farsi</Button>
          </ButtonGroup>
        </ListItem>
      </List>
    </div>
  );
}
