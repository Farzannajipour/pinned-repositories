/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, useState, memo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { Container, Row, Col, Card, CardText, CardTitle } from 'reactstrap';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import {
  makeSelectRepos,
  makeSelectLoading,
  makeSelectError,
} from 'containers/App/selectors';
import H3 from 'components/H2';
import ReposList from 'components/ReposList';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignCenter, faThumbtack } from '@fortawesome/free-solid-svg-icons';
import AtPrefix from './AtPrefix';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.css';
import { GITHUB_TOKEN } from './constants';

const key = 'home';

const GET_ORGANIZATION = `
{
  repositoryOwner(login: "farzannajipour") {
    ... on User {
      pinnedRepositories(first: 6) {
        edges {
          node {
            name,
            id
            description
          }
        }
      }
    }
  }
}

`;

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${GITHUB_TOKEN}`,
  },
});

export function HomePage({
  username,
  loading,
  error,
  repos,
  onSubmitForm,
  onChangeUsername,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const [posts, setPosts] = useState([]);
  const [setErrors] = useState(false);
  const [allRepos, setAllRepos] = useState([]);

  async function fetchRepoData() {
    const res = await fetch(
      'https://api.github.com/users/farzannajipour/repos?type=all&sort=updated',
    );
    res
      .json()
      .then(repoResponse => {
        setAllRepos(repoResponse);
        localStorage.setItem(`githubUrl`, repoResponse[0].owner.url);
        localStorage.setItem(`githubAccount`, repoResponse[0].owner.login);
        localStorage.setItem(`avatar`, repoResponse[0].owner.avatar_url);
      })
      .catch(err => setErrors(err));
  }

  // eslint-disable-next-line no-undef
  useEffect(() => {
    fetchRepoData();
    axiosGitHubGraphQL.post('', { query: GET_ORGANIZATION }).then(result => {
      setPosts(result.data.data.repositoryOwner.pinnedRepositories.edges);
    });
    // When initial state username is not null, submit the form to load repos
    if (username && username.trim().length > 0) onSubmitForm();
  }, []);

  const reposListProps = {
    loading,
    error,
    repos,
  };
  const githubUsername = localStorage.getItem(`githubAccount`)
    ? localStorage.getItem(`githubAccount`)
    : 'FarzanNajipour';

  const avatar = localStorage.getItem(`avatar`);
  const accountName = localStorage.getItem(`githubAccount`);
  const accountUrl = localStorage.getItem(`githubUrl`);

  return (
    <article>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="jStack Assignment homepage" />
      </Helmet>
      <div>
        <Container>
          <Row className="my-5">
            <Col xs={8}>
              <H3 className="mt-2">Here is {githubUsername} Repository: </H3>
              <a href={accountUrl}>
                <p>username: {accountName}</p>
              </a>
            </Col>
            <Col xs={4}>
              <img
                width="100"
                src={avatar}
                className="rounded-circle"
                alt="user-profile"
              />
            </Col>
          </Row>
          <h3 className="mb-2">
            <FontAwesomeIcon icon={faThumbtack} />
            &nbsp;&nbsp;&nbsp; Pinned Repositories
          </h3>
          <Row className="mb-5">
            {posts.map(post => (
              <Col key={post.node.id} sm="6">
                <Card className="pinnedRepos" body>
                  <CardTitle>
                    <strong>{post.node.name}</strong>
                  </CardTitle>
                  <CardText>{post.node.description}</CardText>
                </Card>
              </Col>
            ))}
          </Row>
          <h3 className="mb-2">
            <FontAwesomeIcon icon={faAlignCenter} />
            &nbsp;&nbsp;&nbsp; All Repositories
          </h3>
          <Row>
            {allRepos.map(item => (
              <Col key={item.id} sm="12">
                <Card body>
                  <CardTitle>
                    <strong>{item.name}</strong>
                  </CardTitle>
                  <CardText>{item.description}</CardText>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
        <hr className="mt-5" />
        <Section>
          <H3>
            Or you can try me and find any repo easily:(Press enter after
            typing)
          </H3>
          <Form onSubmit={onSubmitForm}>
            <label htmlFor="username">
              <FormattedMessage {...messages.trymeMessage} />
              <AtPrefix>
                <FormattedMessage {...messages.trymeAtPrefix} />
              </AtPrefix>
              <Input
                id="username"
                type="text"
                placeholder="farzannajipour"
                value={username}
                onChange={onChangeUsername}
              />
            </label>
          </Form>
          <ReposList {...reposListProps} />
        </Section>
      </div>
    </article>
  );
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: evt => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(HomePage);
