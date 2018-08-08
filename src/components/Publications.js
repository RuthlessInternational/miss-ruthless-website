import React from 'react';
import { Link } from 'react-router-dom'
import Prismic from 'prismic-javascript';
import PrismicReact from 'prismic-reactjs';
import moment from 'moment'
import Header from "./Header"

import '../App.css';
import './Competitions.css';


const apiEndpoint = 'https://miss-r.cdn.prismic.io/api/v2';
const options = {
    resizeDebounce: 250,
    duration: 200,
    easing: 'ease-out',
    perPage: 1,
    startIndex: 0,
    draggable: true,
    threshold: 20,
    loop: false,
}

let slider

export default class Publications extends React.Component {
  refsCollection = {};

  state = {
    uid: null,
    publications: null,
    open: false,
    hover: false,
    openCarousel: false,
    featured: false,
    currentSlideNum: 0
  }

  componentWillMount() {
    if (Object.keys(this.props.match.params).length !== 0 && this.props.match.params.constructor === Object) {
        this.setState({open: true, uid: this.props.match.params.uid})
    } 
    this.fetchPage(this.props);
  }

  componentWillReceiveProps(props) {
    this.fetchPage(this.props);
  }

  componentDidUpdate(props) {
    if (this.props.location.pathname === process.env.PUBLIC_URL + "/publications/" && this.state.open){
        this.setState({open: false})
    }
  }

  fetchPage(props) {   
    Prismic.api(apiEndpoint).then(api => {
        api.query(
            Prismic.Predicates.at('document.type', 'publication'), { pageSize : 100, page : 1,orderings : '[my.publication.published_on desc]' }
        ).then(response => {
            this.setState({publications: response.results})
        });
    });
  }

  openComp(uid, index, el) {
      if(this.state.open && this.state.uid === uid){
        this.setState({uid: uid, open: false})
      } else {
        this.setState({uid: uid, open: true})
      }
      this.renderCommpetition(this.state.publications, this.state.open, this.state.uid)
  }

  handleHover(imageUrl) {
    this.setState({featured: imageUrl})
  }

  renderCommpetition(publications, open, uid){
    let data = [];


    if(uid){
        for (var key in publications) {
            if(publications[key].uid === uid) {
                data.push(publications[key]);
            }
        }

        if (data.length > 0) {
            return (
                <section className={this.state.openCarousel ? "details open" : "details"}>
                    <img className="featured" alt="featured" src={data[0].data.image.url} />
                </section>
            )
        }
    } else {
        for (var key in publications) {
            data.push(publications[key]);
        }
        return (
            <section className="details">
                <img className="featured" alt="featured" src={!this.state.featured ?  data[0].data.image.url : this.state.featured} />
            </section>
        )
    }
  }

  renderDownload(link) {
      if(link.url){
        return (
            <div className="label top">
                <p>Download:</p>
                <a href={link.url} className="clip" key={link.name}><p>{link.name}</p></a>
            </div>
        )
    }
  }

  renderPurchase(link) {
    if(link.url){
      return (
          <div className="label top">
              <p>Purchase:</p>
              <a href={link.url} className="clip" key={link.name}><p>{link.name}</p></a>
          </div>
      )
  }
}

  renderList(publications, uid){
    var data = [];
    for (var key in publications) {
        data.push(publications[key]);
    }

    const publication = data.map((comp, index) =>
      <li key={index} ref={(item) => { this.refsCollection[index] = item }} className={comp.uid === this.state.uid || !this.state.open ? "link open" : "link min"}>   
        <Link 
            onClick={(e) => this.openComp(comp.uid, index, this)}
            to={process.env.PUBLIC_URL + "/publications/" + comp.uid} 
            onMouseEnter={(e) => {this.handleHover(comp.data.image.url)}}
            >
            <span className="mincho">
                <h1>{PrismicReact.RichText.render(comp.data.title_chinese)}</h1>
            </span>
            <span className="denver">
                {PrismicReact.RichText.render(comp.data.title_english)}
            </span>
            <p className="date">{moment(comp.data.published_on).format('YYYY/MM/DD')}</p>
        </Link>
        <div className={comp.uid === this.state.uid && this.state.open ? "info" : "info closed"} >
            {PrismicReact.RichText.render(comp.data.description_english)}
            <span className="mincho">{PrismicReact.RichText.render(comp.data.description_chinese)}</span>
            {this.renderDownload(comp.data.link_to_download)}
            {this.renderPurchase(comp.data.link_to_purchase)}
        </div>
      </li>
    );

    return (    
        <section className="publications" id="publications" ref={elem => this.container = elem} >
                {publication}
        </section>
    )
  }

  render() {
    if (this.state.publications) {
        return (
            <div className="frame competitions publications">
                {this.state.open ? 
                    <Header title_english={"Publications"} title_chinese={"競賽"} navTo={this.state.open ? false : true} context={"publications"}/>
                    : 
                    <Header title_english={"Publications"} title_chinese={"競賽"} navTo={this.state.open ? false : true} context={"publications"}/>
                }
                
                <div className="content">
                    <div className="list">
                        {this.renderList(this.state.publications, this.state.uid)}
                    </div>
                    <div className="divider">
                        <div className="line"></div>
                    </div>
                    <div className="view">
                        {/* <h3 className={this.state.open || this.state.hover ? "label" : "label closed"}></h3> */}
                        {this.renderCommpetition(this.state.publications, this.state.open, this.state.uid)}
                    </div>
                    
                </div>
            </div>
        )
    } else {
        return (
            <div className="frame loading">
            {/* <h1>Loading</h1> */}
            <img className="flower animated" alt="flower" src={process.env.PUBLIC_URL + "/images/flower.png"} />
        </div>
        )
    }
  }
}