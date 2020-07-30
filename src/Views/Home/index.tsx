import React from 'react';
import { QueryRenderer } from 'react-relay';
import environment from '../../Relay/Environment';
import HomeQuery from '../../Relay/HomeQuery';

const renderQuery = ({ error, props }: { error: Error | null; props: any }) => {
  if (error) {
    return <div>{error.message}</div>;
  } else if (props) {
    return (
      <div>
        Response: {props.repository!!.name}{' '}
        {props.repository!!.defaultBranchRef.id}
      </div>
    );
  }
  return <div>Loading</div>;
};

export class Home extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={HomeQuery}
        variables={{}}
        render={renderQuery}
      />
    );
  }
}
