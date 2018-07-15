import React from 'react';
import { Link } from 'react-router-dom'
import Prismic from 'prismic-javascript';
import PrismicReact from 'prismic-reactjs';
import {Date} from 'prismic-reactjs';

import moment from 'moment'


import Header from "./Header"

import '../App.css';
import './Competitions.css';


import ReactSiema from 'react-siema'

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

export default class Competitions extends React.Component {
  refsCollection = {};

  state = {
    uid: null,
    competitions: null,
    open: false,
    hover: false,
    openCarousel: false
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
    if (this.props.location.pathname === "/competitions/" && this.state.open){
        this.setState({open: false})
    }
  }

  fetchPage(props) {   
    Prismic.api(apiEndpoint).then(api => {
        api.query(
            Prismic.Predicates.at('document.type', 'competition'), { pageSize : 100, page : 1}
        ).then(response => {
            this.setState({competitions: response.results})
        });
    });

    Prismic.api(apiEndpoint).then(api => {
        api.query(
            Prismic.Predicates.at('document.type', 'contestant'), { pageSize : 100, page : 1}
        ).then(response => {
            this.setState({contestants: response.results})
        });
    });
  }

  openComp(uid, index, el) {
      if(this.state.open && this.state.uid === uid){
        this.setState({uid: uid, open: false})
      } else {
        this.setState({uid: uid, open: true})
      }
      this.renderCommpetition(this.state.competitions, this.state.open, this.state.uid)
  }

  openSlides(){
      this.setState({openCarousel: true})
  }

  closeSlides(){
    this.setState({openCarousel: false})
}

  renderContestant(contestants){
    var data = [];

    if(this.state.contestants){
        for (var key in contestants) {
           let competitions = contestants[key].data.competitions_list
           for (var count in competitions) {
               if(competitions[count].competitions.slug === this.state.uid){
                data.push(contestants[key])
               }
           }
        }

        const Contestants = data.map((cont, index) =>
            <li key={index}>   
                <Link 
                    onClick={(e) => this.openComp(cont.uid)} 
                    to={"/contestants/" + cont.uid}>
                    {PrismicReact.RichText.render(cont.data.name_english)}
                    <span className="mincho">{PrismicReact.RichText.render(cont.data.name_chinese)}</span>
                </Link>
            </li>
        );


        return (
            <div className={this.state.open ? "contestants" : "contestants closed"}>
                <h3 className={this.state.open || this.state.hover ? "label top" : "label top closed"}><span className="mincho">以前的比赛</span> Contestants</h3>

                {Contestants}
                <li><Link className="all" to={"/contestants/"} className={this.state.open || this.state.hover ? "" : "closed"}>提交 See all ></Link></li>
            </div>
        )
    } else {
        return <p>Loading</p>
    }
  }

  renderCommpetition(competitions, open, uid){
    let data = [];

    if(uid){
        let slides = [];

        for (var key in competitions) {
            if(competitions[key].uid === uid) {
                data.push(competitions[key]);
                slides = competitions[key].data.slideshow
            }
        }
    
        const Slides = slides.map((slide, index) =>
            <img  className="green" key={index} src={slide.slide.url} alt="slide" />
        );

        if (data.length > 0) {
            return (
                <section className={this.state.openCarousel ? "details open" : "details"}>
                    {this.renderContestant(this.state.contestants)}
                    {/* <Link className="all" to={"/contestants/"} className={this.state.open || this.state.hover ? "" : "closed"}>提交 See all ></Link> */}
                    <div className={this.state.openCarousel ? "carouselContainer open" : "carouselContainer"}>
                        <div className={this.state.openCarousel ? "close open" : "close"} onClick={(e) => this.closeSlides()}><img src={process.env.PUBLIC_URL + "/images/close.png"} /></div>
                        <div className={this.state.openCarousel ? "arrowLeft open" : "arrowLeft"} ><img src={process.env.PUBLIC_URL + "/images/arrow.png"} onClick={() => slider.prev()}/></div>
                        <div className={this.state.open ? "carousel" : "carousel open"} onClick={(e) => this.openSlides()}>
                            <ReactSiema className="carousel" {...options} ref={siema => slider = siema}>
                                {Slides}
                            </ReactSiema>
                        </div>
                        <div className={this.state.openCarousel ? "arrowRight open" : "arrowRight"}><img src={process.env.PUBLIC_URL + "/images/arrow.png"} onClick={() => slider.next()}/></div>
                    </div>
                </section>
            )
        }
    } else {
        for (var key in competitions) {
            data.push(competitions[key]);
        }
        return (
            <section className="details">
                <img className="featured" src={data[0].data.featured_image.url} />
            </section>
        )
    }
  }

  renderList(competitions, uid){
    var data = [];
    for (var key in competitions) {
        data.push(competitions[key]);
        // console.log(competitions[key].data.date_time)
    }

    const Competition = data.map((comp, index) =>
      <li key={index} ref={(item) => { this.refsCollection[index] = item }} className={comp.uid === this.state.uid || !this.state.open ? "link open" : "link min"}>   
        <Link onClick={(e) => this.openComp(comp.uid, index, this)} to={"/competitions/" + comp.uid}>
            <span className="mincho">
                <h1>{PrismicReact.RichText.render(comp.data.title_chinese)}</h1>
            </span>
            <span className="denver">
                {PrismicReact.RichText.render(comp.data.title_english)}
            </span>
            <p className="date">{moment(Date(comp.data.date_time).toString()).format("ll")}</p>
        </Link>
        <div className={comp.uid === this.state.uid && this.state.open ? "info" : "info closed"} >
            {PrismicReact.RichText.render(comp.data.description_english)}
            <span className="mincho">{PrismicReact.RichText.render(comp.data.description_chinese)}</span>
        </div>
      </li>
    );

    return (    
        <section className="competitions" id="competitions" ref={elem => this.container = elem} >
                {Competition}
        </section>
    )
  }

  render() {
    if (this.state.competitions) {
        return (
            <div className="frame competitions">
                {this.state.open ? 
                    <Header title_english={"Competition"} title_chinese={"比赛 "} navTo={this.state.open ? false : true} context="competitions"/>
                    : 
                    <Header title_english={"Past Competitions"} title_chinese={"以前的比赛 "} navTo={this.state.open ? false : true} context="competitions"/>
                }
                
                <div className="content">
                    <div className="list">
                        {this.renderList(this.state.competitions, this.state.uid)}
                    </div>
                    <div className="divider">
                        <div className="line"></div>
                    </div>
                    <div className="view">
                        <h3 className={this.state.open || this.state.hover ? "label" : "label closed"}></h3>
                        {this.renderCommpetition(this.state.competitions, this.state.open, this.state.uid)}
                    </div>
                    
                </div>
            </div>
        )
    } else {
        return (
            <div className="frame loading">
            {/* <h1>Loading</h1> */}
            <img className="flower animated" src={process.env.PUBLIC_URL + "/images/flower.png"} />
        </div>
        )
    }
  }
}