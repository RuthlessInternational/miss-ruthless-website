import React from 'react';

export default class About extends React.Component {

  // state = {
  //   doc: null,
  //   notFound: false,
  // }

  componentDidMount() {
    // const { handle } = this.props.match.params
    // this.fetchPage(this.props);
  }

  // componentWillMount() {
  //   this.fetchPage(this.props);
  // }

  // componentWillReceiveProps(props) {
  //   this.fetchPage(props);
  // }

  // componentDidUpdate() {
  //   this.props.prismicCtx.toolbar();
  // }

  // fetchPage(props) {
  //   if (props.prismicCtx) {
  //     // We are using the function to get a document by its uid
  //     return props.prismicCtx.api.getByUID('contestant', props.match.params.uid, {}, (err, doc) => {
  //       if (doc) {
  //         // We put the retrieved content in the state as a doc variable
  //         this.setState({ doc });
  //       } else {
  //         // We changed the state to display error not found if no matched doc
  //         this.setState({ notFound: !doc });
  //       }
  //     });
  //   }
  //   return null;
  // }

  render() {
    return <h1>About</h1>;
  }
}