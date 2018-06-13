import React from 'react';
import PropTypes from 'prop-types';
import {graphql, createFragmentContainer} from 'react-relay';

import IssueishListView from '../views/issueish-list-view';
import Issueish from '../models/issueish';

export class IssueishListController extends React.Component {
  static propTypes = {
    results: PropTypes.shape({
      issueCount: PropTypes.number.isRequired,
      nodes: PropTypes.arrayOf(
        PropTypes.shape({
          number: PropTypes.number.isRequired,
          title: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
          author: PropTypes.shape({
            login: PropTypes.string.isRequired,
            avatarUrl: PropTypes.string.isRequired,
          }).isRequired,
          createdAt: PropTypes.string.isRequired,
          headRefName: PropTypes.string.isRequired,
          headRepository: PropTypes.shape({
            nameWithOwner: PropTypes.string.isRequired,
          }).isRequired,
        }),
      ),
    }),
  };

  static getDerivedStateFromProps(props, state) {
    if (props.results === null) {
      return {
        isLoading: true,
        total: 0,
        issueishes: [],
      };
    }

    return {
      isLoading: false,
      total: props.results.issueCount,
      issueishes: props.results.nodes.map(node => new Issueish(node)),
    };
  }

  render() {
    return (
      <IssueishListView
        isLoading={this.state.isLoading}
        total={this.state.total}
        issueishes={this.state.issueishes}
      />
    );
  }
}

export default createFragmentContainer(IssueishListController, {
  results: graphql`
    fragment issueishListController_results on SearchResultItemConnection {
      issueCount
      nodes {
        ... on PullRequest {
          number
          title
          url
          author {
            login
            avatarUrl
          }
          createdAt
          headRefName
          headRepository {
            nameWithOwner
          }
        }
      }
    }
  `,
});