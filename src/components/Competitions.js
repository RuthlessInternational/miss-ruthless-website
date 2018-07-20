import React from 'react';
import { Link } from 'react-router-dom'
import Prismic from 'prismic-javascript';
import PrismicReact from 'prismic-reactjs';
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
    if (this.props.location.pathname === process.env.PUBLIC_URL + "/competitions/" && this.state.open){
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

    handleHover(imageUrl) {
        this.setState({featured: imageUrl})
    }

   changeSlides(dir) {
    if(dir==="next"){
        slider.next()
    } else{
        slider.prev()
    }
    this.setState({currentSlideNum: slider.currentSlide})
     console.log(slider.currentSlide)
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
                    to={process.env.PUBLIC_URL + "/contestants/" + cont.uid}
                    className="contestant-name">
                    {PrismicReact.RichText.render(cont.data.name_english)}
                    <span className="mincho">{PrismicReact.RichText.render(cont.data.name_chinese)}</span>
                </Link>
            </li>
        );


        return (
            <div className={this.state.open ? "contestants" : "contestants closed"}>
                <h3 className={this.state.open || this.state.hover ? "label top" : "label top closed"}><span className="mincho">以前的比赛</span> Contestants</h3>
                {Contestants}
                {/* <li><Link to={process.env.PUBLIC_URL + "/contestants/"} className={this.state.open || this.state.hover ? "" : "closed"}>See all ><span className="mincho">提交</span> </Link></li> */}
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
                    <div className={this.state.openCarousel ? "carouselContainer open" : "carouselContainer"}>
                        <div className={this.state.openCarousel ? "close open" : "close"} onClick={(e) => this.closeSlides()}>
                            <img alt="close" src={process.env.PUBLIC_URL + "/images/close.png"} />
                        </div>
                        <div className={this.state.openCarousel ? "arrowLeft open" : "arrowLeft"} >
                            <img alt="prev" style={this.state.currentSlideNum <= 0 ? {opacity: .3} : {opacity: 1}} src={process.env.PUBLIC_URL + "/images/arrow.png"} onClick={() => this.changeSlides("prev")}/>
                        </div>
                        <div className={this.state.open ? "carousel" : "carousel open"} onClick={(e) => this.openSlides()}>
                            <ReactSiema className="carousel" {...options} ref={siema => slider = siema}>
                                {Slides}
                            </ReactSiema>
                        </div>
                        <div className={this.state.openCarousel ? "arrowRight open" : "arrowRight"}>
                            <img alt="next" style={this.state.currentSlideNum >= slides.length-1 ? {opacity: .3} : {opacity: 1}} src={process.env.PUBLIC_URL + "/images/arrow.png"} onClick={() => this.changeSlides("next")}/>
                        </div>
                    </div>
                </section>
            )
        }
    } else {
        for (key in competitions) {
            data.push(competitions[key]);
        }
        return (
            <section className="details">
                <img className="featured" alt="featured" src={!this.state.featured ?  data[0].data.featured_image.url : this.state.featured} />
            </section>
        )
    }
  }

  renderClippings(clippings) {
    // console.log(clippings)
    const Clips = clippings.map((clip, index) =>
        <a href={clip.clipping.url} className="clip" key={index}><p>{clip.clipping.name}</p></a>
    );

    if (clippings.length > 0) {
        return (
            <div className="clips">
                <p className="label top">Press and Media:</p>
                {Clips}
            </div>
        )
    }
  }

  renderList(competitions, uid){
    var data = [];
    for (var key in competitions) {
        data.push(competitions[key]);
    }

    const Competition = data.map((comp, index) =>
      <li key={index} ref={(item) => { this.refsCollection[index] = item }} className={comp.uid === this.state.uid || !this.state.open ? "link open" : "link min"}>   
        <Link 
            onClick={(e) => this.openComp(comp.uid, index, this)}
            to={process.env.PUBLIC_URL + "/competitions/" + comp.uid} 
            onMouseEnter={(e) => {this.handleHover(comp.data.featured_image.url)}}>
            <span className="mincho">
                <h1>{PrismicReact.RichText.render(comp.data.title_chinese)}</h1>
            </span>
            <span className="denver">
                {PrismicReact.RichText.render(comp.data.title_english)}
            </span>
            <p className="date">{moment(comp.data.date_time).format('YYYY/MM/DD')}</p>
        </Link>
        <div className={comp.uid === this.state.uid && this.state.open ? "info" : "info closed"} >
            {PrismicReact.RichText.render(comp.data.description_english)}
            <span className="mincho">{PrismicReact.RichText.render(comp.data.description_chinese)}</span>
            {typeof comp.data.video.html === "undefined" ? <div></div> : <div className="video-container" dangerouslySetInnerHTML={{__html: comp.data.video.html}}></div>}
            {this.renderClippings(comp.data.clipping_list)}
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
                    <Header title_english={"Competition"} title_chinese={"競賽"} navTo={this.state.open ? false : true} context={"competitions"}/>
                    : 
                    <Header title_english={"Competitions"} title_chinese={"競賽"} navTo={this.state.open ? false : true} context={"competitions"}/>
                }
                
                <div className="content">
                    <div className="list">
                        {this.renderList(this.state.competitions, this.state.uid)}
                    </div>
                    <div className="divider">
                        <div className="line"></div>
                    </div>
                    <div className="view">
                        {/* <h3 className={this.state.open || this.state.hover ? "label" : "label closed"}></h3> */}
                        {this.renderCommpetition(this.state.competitions, this.state.open, this.state.uid)}
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