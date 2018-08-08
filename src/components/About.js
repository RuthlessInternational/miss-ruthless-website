import React from 'react';
import Prismic from 'prismic-javascript';
import PrismicReact from 'prismic-reactjs';

import Header from "./Header"
import './About.css';

const apiEndpoint = 'https://miss-r.cdn.prismic.io/api/v2';


export default class About extends React.Component {

  state = {
      about: null
  }

  componentWillMount() {
    if (Object.keys(this.props.match.params).length !== 0 && this.props.match.params.constructor === Object) {
        this.setState({open: true, uid: this.props.match.params.uid})
        this.fetchContestant()
    } 
    this.fetchPage(this.props);
  }

  componentDidMount() {
    // console.log(this.props)
  }

  componentDidUpdate(props) {
    if (this.props.location.pathname === "/contestants/" && this.state.open){
        this.setState({open: false})
    }
  }

  componentWillReceiveProps(props) {
    this.fetchContestant()
  }

  fetchPage(props) {   
    Prismic.api(apiEndpoint).then(api => {
        api.query(
            Prismic.Predicates.at('document.type', 'about'), { pageSize : 100, page : 1}
        ).then(response => {
            this.setState({about: response.results})
        });
    });

  }

  render() {
    if (this.state.about) {
      return (
        <div className="frame about">
            <Header title_english={"About"} title_chinese={"關於我們"} navTo={this.state.open ? false : true} context="about"/>
            <div className="content">
                <div className="list">
                    {PrismicReact.RichText.render(this.state.about[0].data.text_english)}
                    <span className="mincho">{PrismicReact.RichText.render(this.state.about[0].data.text_chinese)}</span>
                </div>
                <div className="divider">
                    <div className="line"></div>
                </div>
                <div className="view">
                    <img className="featured" alt="featured" src={this.state.about[0].data.about_image.url} />
                    <div className="credits">
                        <h3>Art Direction</h3>
                        <p>Eric Hu and Matthew Tsang</p>
                        <h3>Design and Programming</h3>
                        <p>Callil Capuozzo and Phil Cao</p>
                    </div>
                </div>
            </div>
        </div>
      );
    } else {
      return (
        <div className="frame loading">
            <img className="flower animated" alt="flower" src={process.env.PUBLIC_URL + "/images/flower.png"} />
        </div>
    )
    }
  }
}